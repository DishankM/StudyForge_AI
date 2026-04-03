import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { extractDocumentText } from "@/lib/extractors";
import { chunkDocumentText, normalizePromptText } from "./document-chunking";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface GenerateMCQOptions {
  documentId: string;
  userId: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  includeExplanations?: boolean;
  mode?: "fast" | "full";
}

const MCQ_SYSTEM_PROMPT = `You are an expert exam question creator. You generate high-quality multiple-choice questions that:
- Test genuine understanding, not just memory
- Have one definitively correct answer
- Include plausible but clearly wrong distractors
- Cover different concepts from the material
- Are clearly worded and unambiguous`;

function parseQuestions(response: string) {
  const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleanedResponse) as MCQQuestion[];
}

function validateQuestions(questions: MCQQuestion[]) {
  return questions.filter((q) => {
    return (
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === "number" &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < 4
    );
  });
}

function dedupeQuestions(questions: MCQQuestion[]) {
  const seen = new Set<string>();
  const unique: MCQQuestion[] = [];

  for (const question of questions) {
    const key = normalizePromptText(question.question);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(question);
  }

  return unique;
}

function selectBestQuestions(
  questions: MCQQuestion[],
  count: number,
  difficulty: NonNullable<GenerateMCQOptions["difficulty"]>
) {
  if (questions.length <= count) {
    return questions;
  }

  if (difficulty !== "mixed") {
    const exactDifficulty = questions.filter((q) => q.difficulty === difficulty);
    const fallback = questions.filter((q) => q.difficulty !== difficulty);
    return [...exactDifficulty, ...fallback].slice(0, count);
  }

  const buckets: Record<MCQQuestion["difficulty"], MCQQuestion[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const question of questions) {
    buckets[question.difficulty]?.push(question);
  }

  const ordered: MCQQuestion[] = [];
  const cycle: Array<MCQQuestion["difficulty"]> = ["easy", "medium", "hard"];

  while (ordered.length < count && cycle.some((level) => buckets[level].length > 0)) {
    for (const level of cycle) {
      const next = buckets[level].shift();
      if (next) {
        ordered.push(next);
      }
      if (ordered.length >= count) {
        break;
      }
    }
  }

  return ordered.slice(0, count);
}

export async function generateMCQs({
  documentId,
  userId,
  count = 20,
  difficulty = "mixed",
  includeExplanations = true,
  mode = "fast",
}: GenerateMCQOptions) {
  try {
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const extractedText = await extractDocumentText(document.fileUrl, document.mimeType);
    const allTextChunks = chunkDocumentText(extractedText, {
      targetChunkChars: 4000,
      maxChunkChars: 5000,
    });

    if (allTextChunks.length === 0) {
      throw new Error("No readable document content found");
    }

    const textChunks =
      mode === "fast" ? allTextChunks.slice(0, Math.min(3, allTextChunks.length)) : allTextChunks;

    const targetQuestionPool = Math.max(count * 2, count + textChunks.length * 2);
    const perChunkCount = Math.max(3, Math.ceil(targetQuestionPool / textChunks.length));
    const generatedQuestions: MCQQuestion[] = [];

    for (let index = 0; index < textChunks.length; index += 1) {
      const chunk = textChunks[index];
      const userPrompt = `Generate ${perChunkCount} multiple-choice questions from chunk ${index + 1} of ${textChunks.length}.

CONTENT:
${chunk}

REQUIREMENTS:
- Difficulty: ${difficulty}
- ${includeExplanations ? "Include detailed explanations (3-4 sentences)" : "No explanations needed"}
- Each question must have exactly 4 options
- Only ONE correct answer per question
- Cover different ideas from this chunk
- Questions should test understanding and application, not just recall
- Avoid repeating questions from the same chunk
- Avoid "all of the above" or "none of the above"

Return ONLY a JSON array with this exact structure (no markdown, no backticks, no preamble):
[
  {
    "id": "q1",
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    "correctAnswer": 1,
    "explanation": "Binary search has O(log n) time complexity because it divides the search space in half with each iteration.",
    "difficulty": "medium",
    "topic": "Algorithms"
  }
]`;

      try {
        const response = await callGroq(userPrompt, MCQ_SYSTEM_PROMPT, 5000);
        const parsed = parseQuestions(response);
        generatedQuestions.push(...validateQuestions(parsed));
      } catch (error) {
        console.warn(`MCQ generation failed for chunk ${index + 1}:`, error);
      }
    }

    const uniqueQuestions = dedupeQuestions(generatedQuestions);
    const selectedQuestions = selectBestQuestions(uniqueQuestions, count, difficulty).map(
      (question, index) => ({
        ...question,
        id: `q${index + 1}`,
      })
    );

    if (selectedQuestions.length === 0) {
      throw new Error("No valid questions generated");
    }

    const mcqSet = await prisma.mcqSet.create({
      data: {
        userId,
        documentId,
        title: `${document.fileName} - MCQ Practice`,
        questions: selectedQuestions as unknown as Prisma.InputJsonValue,
        difficulty,
      },
    });

    return {
      success: true,
      mcqSet,
      questionCount: selectedQuestions.length,
      chunkCount: textChunks.length,
      mode,
    };
  } catch (error) {
    console.error("MCQ generation error:", error);
    throw error;
  }
}
