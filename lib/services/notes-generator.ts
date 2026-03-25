import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { extractDocumentText } from "@/lib/extractors";

interface GenerateNotesOptions {
  documentId: string;
  userId: string;
  format?: "concise" | "detailed" | "bullet-points";
  includeExamples?: boolean;
}

export async function generateNotes({
  documentId,
  userId,
  format = "concise",
  includeExamples = true,
}: GenerateNotesOptions) {
  try {
    // 1. Get document from database
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: userId,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // 2. Extract text from document
    const extractedText = await extractDocumentText(
      document.fileUrl,
      document.mimeType
    );
    const maxChunkLength = 6000;
    const textChunk = extractedText.slice(0, maxChunkLength);

    // 3. Prepare AI prompt
    const systemPrompt = `You are an expert educational content creator specializing in creating exam-ready study notes for students. Your notes are:
- Clear and concise
- Well-structured with proper headings
- Focus on key concepts and definitions
- Include important formulas, dates, or facts
- Exam-oriented and practical`;

    const userPrompt = `Extract and transform the following document into ${format} study notes optimized for exam preparation.

DOCUMENT CONTENT:
${textChunk}

REQUIREMENTS:
- Use markdown formatting with clear hierarchical headings (# H1, ## H2, ### H3)
- Create bullet points for key concepts
- Highlight important terms in **bold**
- Use numbered lists for sequential processes or steps
- ${includeExamples ? "Include practical examples where helpful" : "Focus only on core concepts without examples"}
- Keep language clear and student-friendly
- Focus ONLY on exam-relevant material
- Remove any fluff or repetitive content
- Organize content logically by topic

FORMAT STYLE:
${format === "concise" ? "Brief and to-the-point, 40-50% of original length" : ""}
${format === "detailed" ? "Comprehensive with explanations, 60-70% of original length" : ""}
${format === "bullet-points" ? "Heavy use of bullet points and short phrases" : ""}

TARGET: ${document.subject || "General"} students preparing for exams

Return ONLY the formatted notes in markdown. No preamble, no explanation, just the notes.`;

    // 4. Call Groq API
    const notesContent = await callGroq(userPrompt, systemPrompt, 6000);

    // 5. Calculate word count
    const wordCount = notesContent.split(/\s+/).length;

    // 6. Save to database
    const note = await prisma.note.create({
      data: {
        userId,
        documentId,
        title: `${document.fileName} - Study Notes`,
        content: notesContent,
        wordCount,
        format,
      },
    });

    return {
      success: true,
      note,
    };
  } catch (error) {
    console.error("Notes generation error:", error);
    throw error;
  }
}
