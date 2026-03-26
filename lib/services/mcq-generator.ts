import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { extractDocumentText } from "@/lib/extractors";

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
}

export async function generateMCQs({
  documentId,
  userId,
  count = 20,
  difficulty = "mixed",
  includeExplanations = true,
}: GenerateMCQOptions) {
  try {
    // 1. Get document
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // 2. Extract text
    const extractedText = await extractDocumentText(
      document.fileUrl,
      document.mimeType
    );

    // 3. Chunk text if too long (The model has token limits)
    const maxChunkLength = 6000; // characters
    const textChunk = extractedText.slice(0, maxChunkLength);

    // 4. Prepare prompt
    const systemPrompt = `You are an expert exam question creator. You generate high-quality multiple-choice questions that:
- Test genuine understanding, not just memory
- Have one definitively correct answer
- Include plausible but clearly wrong distractors
- Cover different concepts from the material
- Are clearly worded and unambiguous`;

    const userPrompt = `Generate ${count} multiple-choice questions from this educational content.

CONTENT:
${textChunk}

REQUIREMENTS:
- Difficulty: ${difficulty}
- ${includeExplanations ? "Include detailed explanations (3-4 sentences)" : "No explanations needed"}
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Make distractors plausible but clearly incorrect
- Cover different topics/concepts (don't repeat)
- Questions should test understanding and application, not just recall
- Avoid "all of the above" or "none of the above"
- Don't use negative phrasing unless necessary

Return ONLY a JSON array with this exact structure (no markdown, no backticks, no preamble):
[
  {
    "id": "q1",
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    "correctAnswer": 1,
    "explanation": "Binary search has O(log n) time complexity because it divides the search space in half with each iteration, making it very efficient for sorted arrays.",
    "difficulty": "medium",
    "topic": "Algorithms"
  }
]

Generate ${count} questions following this structure.`;

    // 5. Call Groq
    const response = await callGroq(userPrompt, systemPrompt, 16000);

    // 6. Parse JSON response
    let questions: MCQQuestion[];
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      questions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse MCQ response from AI");
    }

    // 7. Validate questions
    const validQuestions = questions.filter((q) => {
      return (
        q.question &&
        q.options &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < 4
      );
    });

    if (validQuestions.length === 0) {
      throw new Error("No valid questions generated");
    }

    // 8. Save to database
    const mcqSet = await prisma.mcqSet.create({
      data: {
        userId,
        documentId,
        title: `${document.fileName} - MCQ Practice`,
        questions: validQuestions as unknown as Prisma.InputJsonValue,
        difficulty,
      },
    });

    return {
      success: true,
      mcqSet,
      questionCount: validQuestions.length,
    };
  } catch (error) {
    console.error("MCQ generation error:", error);
    throw error;
  }
}
