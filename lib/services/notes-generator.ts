import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { extractDocumentText } from "@/lib/extractors";
import { chunkDocumentText } from "./document-chunking";

interface GenerateNotesOptions {
  documentId: string;
  userId: string;
  format?: "concise" | "detailed" | "bullet-points";
  includeExamples?: boolean;
  mode?: "fast" | "full";
}

const NOTES_SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating exam-ready study notes for students. Your notes are:
- Clear and concise
- Well-structured with proper headings
- Focus on key concepts and definitions
- Include important formulas, dates, or facts
- Exam-oriented and practical`;

function getFormatStyle(format: GenerateNotesOptions["format"]) {
  switch (format) {
    case "detailed":
      return "Comprehensive with explanations, 60-70% of original meaning preserved.";
    case "bullet-points":
      return "Heavy use of bullet points and short phrases.";
    case "concise":
    default:
      return "Brief and to-the-point, focused on revision.";
  }
}

async function summarizeChunk({
  chunk,
  chunkIndex,
  totalChunks,
  format,
  includeExamples,
  subject,
}: {
  chunk: string;
  chunkIndex: number;
  totalChunks: number;
  format: NonNullable<GenerateNotesOptions["format"]>;
  includeExamples: boolean;
  subject: string | null | undefined;
}) {
  const prompt = `You are summarizing chunk ${chunkIndex + 1} of ${totalChunks} from a larger study document.

CHUNK CONTENT:
${chunk}

REQUIREMENTS:
- Extract only exam-relevant content from this chunk
- Preserve important definitions, formulas, facts, and processes
- Use short markdown headings where useful
- Use bullet points for concepts and numbered lists for steps
- ${includeExamples ? "Keep only the most useful examples from this chunk" : "Do not add examples"}
- Do not repeat points inside the same chunk summary
- Keep this as an intermediate summary, not a final polished document

FORMAT STYLE:
${getFormatStyle(format)}

TARGET: ${subject || "General"} students preparing for exams

Return ONLY the chunk summary in markdown.`;

  return callGroq(prompt, NOTES_SYSTEM_PROMPT, 2500);
}

async function mergeSummaries({
  summaries,
  format,
  includeExamples,
  subject,
}: {
  summaries: string[];
  format: NonNullable<GenerateNotesOptions["format"]>;
  includeExamples: boolean;
  subject: string | null | undefined;
}) {
  const summaryText = summaries.join("\n\n---\n\n");
  const prompt = `Combine the following chunk summaries into one coherent final set of study notes.

CHUNK SUMMARIES:
${summaryText}

REQUIREMENTS:
- Merge overlapping ideas into one clean explanation
- Remove repetition across chunks
- Use markdown with clear hierarchical headings (#, ##, ###)
- Highlight important terms in **bold**
- Use bullet points for key concepts
- Use numbered lists for sequences or procedures
- ${includeExamples ? "Retain only the strongest examples where they add value" : "Remove examples and keep only core concepts"}
- Keep the notes student-friendly and exam-oriented
- Organize by topic, not by chunk number

FORMAT STYLE:
${getFormatStyle(format)}

TARGET: ${subject || "General"} students preparing for exams

Return ONLY the final polished notes in markdown.`;

  return callGroq(prompt, NOTES_SYSTEM_PROMPT, 5000);
}

export async function generateNotes({
  documentId,
  userId,
  format = "concise",
  includeExamples = true,
  mode = "full",
}: GenerateNotesOptions) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
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
      mode === "fast" ? allTextChunks.slice(0, Math.min(2, allTextChunks.length)) : allTextChunks;

    const chunkSummaries: string[] = [];
    for (let index = 0; index < textChunks.length; index += 1) {
      const chunk = textChunks[index];
      chunkSummaries.push(
        await summarizeChunk({
          chunk,
          chunkIndex: index,
          totalChunks: textChunks.length,
          format,
          includeExamples,
          subject: document.subject,
        })
      );
    }

    let collapsedSummaries = chunkSummaries;
    while (collapsedSummaries.length > 3) {
      const summaryGroups = chunkDocumentText(collapsedSummaries.join("\n\n"), {
        targetChunkChars: 4500,
        maxChunkChars: 5500,
      });

      const nextLevel: string[] = [];
      for (const group of summaryGroups) {
        nextLevel.push(
          await mergeSummaries({
            summaries: [group],
            format,
            includeExamples,
            subject: document.subject,
          })
        );
      }

      collapsedSummaries = nextLevel;
    }

    const notesContent = await mergeSummaries({
      summaries: collapsedSummaries,
      format,
      includeExamples,
      subject: document.subject,
    });

    const wordCount = notesContent.split(/\s+/).filter(Boolean).length;

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
      chunkCount: textChunks.length,
      mode,
    };
  } catch (error) {
    console.error("Notes generation error:", error);
    throw error;
  }
}
