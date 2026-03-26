import { callGroq } from "@/lib/groq";
import { extractDocumentText } from "@/lib/extractors";
import { Prisma } from "@prisma/client";

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
}

export async function generateVivaQuestions({
  documentId,
  userId,
  count = 25,
  depth = "detailed",
}: GenerateVivaOptions) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const extractedText = await extractDocumentText(
      document.fileUrl,
      document.mimeType
    );

    const systemPrompt = `You are an experienced professor conducting oral examinations. Generate viva questions that:
- Test conceptual understanding
- Encourage explanation and reasoning
- Cover theory, application, and analysis
- Progress from basic to advanced
- Are open-ended but have clear expected answers`;

    const userPrompt = `Generate ${count} viva (oral examination) questions from this content.

CONTENT:
${extractedText.slice(0, 6000)}

REQUIREMENTS:
- Question depth: ${depth}
- Mix of definition, explanation, application, and analysis questions
- Include both short-answer and discussion questions
- Cover different topics comprehensively
- Questions should be clear and specific

Return ONLY a JSON array (no markdown, no backticks):
[
  {
    "id": "v1",
    "question": "Explain the difference between a stack and a queue. Provide real-world examples.",
    "answer": "A stack follows LIFO (Last-In-First-Out) principle, like a stack of plates. A queue follows FIFO (First-In-First-Out) principle, like a line at a ticket counter. Stack operations are push/pop, queue operations are enqueue/dequeue.",
    "difficulty": "basic",
    "topic": "Data Structures"
  }
]`;

    const response = await callGroq(userPrompt, systemPrompt, 6000);

    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions: VivaQuestion[] = JSON.parse(cleanedResponse);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        vivaQuestions: questions as unknown as Prisma.InputJsonValue,
        vivaGeneratedAt: new Date(),
      },
    });

    return {
      success: true,
      questions,
    };
  } catch (error) {
    console.error("Viva generation error:", error);
    throw error;
  }
}
