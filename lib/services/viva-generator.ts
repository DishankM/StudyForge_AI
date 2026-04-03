import { callGroq } from "@/lib/groq";
import { extractDocumentText } from "@/lib/extractors";
import { Prisma } from "@prisma/client";
import { chunkDocumentText, normalizePromptText } from "./document-chunking";

interface VivaQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
  topic: string;
}

interface GenerateVivaOptions {
  documentId: string;
  userId: string;
  count?: number;
  depth?: "surface" | "detailed" | "expert";
  mode?: "fast" | "full";
}

const VIVA_SYSTEM_PROMPT = `You are an experienced professor conducting oral examinations. Generate viva questions that:
- Test conceptual understanding
- Encourage explanation and reasoning
- Cover theory, application, and analysis
- Progress from basic to advanced
- Are open-ended but have clear expected answers`;

function parseQuestions(response: string) {
  const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleanedResponse) as VivaQuestion[];
}

function validateQuestions(questions: VivaQuestion[]) {
  return questions.filter((question) => question.question && question.answer);
}

function dedupeQuestions(questions: VivaQuestion[]) {
  const seen = new Set<string>();
  const unique: VivaQuestion[] = [];

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
  questions: VivaQuestion[],
  count: number,
  depth: NonNullable<GenerateVivaOptions["depth"]>
) {
  if (questions.length <= count) {
    return questions;
  }

  const preferredOrder: VivaQuestion["difficulty"][] =
    depth === "surface"
      ? ["basic", "intermediate", "advanced"]
      : depth === "expert"
      ? ["advanced", "intermediate", "basic"]
      : ["basic", "intermediate", "advanced"];

  const buckets: Record<VivaQuestion["difficulty"], VivaQuestion[]> = {
    basic: [],
    intermediate: [],
    advanced: [],
  };

  for (const question of questions) {
    buckets[question.difficulty]?.push(question);
  }

  const selected: VivaQuestion[] = [];
  while (selected.length < count && preferredOrder.some((level) => buckets[level].length > 0)) {
    for (const level of preferredOrder) {
      const next = buckets[level].shift();
      if (next) {
        selected.push(next);
      }
      if (selected.length >= count) {
        break;
      }
    }
  }

  return selected.slice(0, count);
}

export async function generateVivaQuestions({
  documentId,
  userId,
  count = 25,
  depth = "detailed",
  mode = "fast",
}: GenerateVivaOptions) {
  try {
    const { prisma } = await import("@/lib/prisma");

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
    const generatedQuestions: VivaQuestion[] = [];

    for (let index = 0; index < textChunks.length; index += 1) {
      const chunk = textChunks[index];
      const userPrompt = `Generate ${perChunkCount} viva (oral examination) questions from chunk ${index + 1} of ${textChunks.length}.

CONTENT:
${chunk}

REQUIREMENTS:
- Question depth: ${depth}
- Mix of definition, explanation, application, and analysis questions
- Include both short-answer and discussion questions
- Cover different topics from this chunk
- Avoid repeating questions from the same chunk

Return ONLY a JSON array (no markdown, no backticks):
[
  {
    "id": "v1",
    "question": "Explain the difference between a stack and a queue. Provide real-world examples.",
    "answer": "A stack follows LIFO and a queue follows FIFO, with examples and typical operations.",
    "difficulty": "basic",
    "topic": "Data Structures"
  }
]`;

      try {
        const response = await callGroq(userPrompt, VIVA_SYSTEM_PROMPT, 4500);
        const parsed = parseQuestions(response);
        generatedQuestions.push(...validateQuestions(parsed));
      } catch (error) {
        console.warn(`Viva generation failed for chunk ${index + 1}:`, error);
      }
    }

    const uniqueQuestions = dedupeQuestions(generatedQuestions);
    const selectedQuestions = selectBestQuestions(uniqueQuestions, count, depth).map(
      (question, index) => ({
        ...question,
        id: `v${index + 1}`,
      })
    );

    if (selectedQuestions.length === 0) {
      throw new Error("No valid viva questions generated");
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        vivaQuestions: selectedQuestions as unknown as Prisma.InputJsonValue,
        vivaGeneratedAt: new Date(),
      },
    });

    return {
      success: true,
      questions: selectedQuestions,
      chunkCount: textChunks.length,
      mode,
    };
  } catch (error) {
    console.error("Viva generation error:", error);
    throw error;
  }
}
