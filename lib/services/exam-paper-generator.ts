import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { extractDocumentText } from "@/lib/extractors";
import { chunkDocumentText } from "./document-chunking";

interface GenerateExamPaperOptions {
  userId: string;
  title: string;
  university: string;
  subject: string;
  template: string;
  duration: number;
  totalMarks: number;
  sections: any[];
  documentIds?: string[];
  mode?: "fast" | "full";
}

const EXAM_SYSTEM_PROMPT = `You are an expert university exam paper setter. You create professional, well-formatted exam papers that:
- Follow university formatting standards
- Have clear, unambiguous questions
- Test various levels of understanding
- Include proper mark allocation
- Have appropriate difficulty distribution`;

async function summarizeExamChunk({
  chunk,
  chunkIndex,
  totalChunks,
  subject,
  sourceName,
}: {
  chunk: string;
  chunkIndex: number;
  totalChunks: number;
  subject: string;
  sourceName: string;
}) {
  const prompt = `You are preparing source material for a university exam paper.

SOURCE DOCUMENT: ${sourceName}
CHUNK: ${chunkIndex + 1} of ${totalChunks}

CONTENT:
${chunk}

REQUIREMENTS:
- Extract only concepts that are useful for exam-paper creation
- Identify key topics, subtopics, definitions, formulas, and likely question areas
- Note any processes, comparisons, derivations, or applications that can become questions
- Keep the summary concise and structured
- Avoid conversational wording

TARGET SUBJECT:
${subject}

Return ONLY a compact markdown summary.`;

  return callGroq(prompt, EXAM_SYSTEM_PROMPT, 2500);
}

async function mergeExamSummaries({
  summaries,
  subject,
  sourceName,
}: {
  summaries: string[];
  subject: string;
  sourceName: string;
}) {
  const prompt = `Merge these intermediate exam-source summaries into one coherent context brief for question-setting.

SOURCE DOCUMENT: ${sourceName}

SUMMARIES:
${summaries.join("\n\n---\n\n")}

REQUIREMENTS:
- Merge overlapping ideas
- Remove repetition
- Organize by exam-relevant topics
- Keep it concise but complete enough to draft questions from
- Highlight major concepts, applications, and problem areas

TARGET SUBJECT:
${subject}

Return ONLY the merged source brief in markdown.`;

  return callGroq(prompt, EXAM_SYSTEM_PROMPT, 3500);
}

async function buildDocumentExamBrief({
  fileName,
  extractedText,
  subject,
  mode,
}: {
  fileName: string;
  extractedText: string;
  subject: string;
  mode: "fast" | "full";
}) {
  const allChunks = chunkDocumentText(extractedText, {
    targetChunkChars: 4000,
    maxChunkChars: 5000,
  });

  const chunks = mode === "fast" ? allChunks.slice(0, Math.min(2, allChunks.length)) : allChunks;

  if (chunks.length === 0) {
    return null;
  }

  const chunkSummaries: string[] = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    chunkSummaries.push(
      await summarizeExamChunk({
        chunk,
        chunkIndex: index,
        totalChunks: chunks.length,
        subject,
        sourceName: fileName,
      })
    );
  }

  let merged = chunkSummaries;
  while (merged.length > 3) {
    const grouped = chunkDocumentText(merged.join("\n\n"), {
      targetChunkChars: 4500,
      maxChunkChars: 5500,
    });

    const nextLevel: string[] = [];
    for (const group of grouped) {
      nextLevel.push(
        await mergeExamSummaries({
          summaries: [group],
          subject,
          sourceName: fileName,
        })
      );
    }
    merged = nextLevel;
  }

  const finalBrief = await mergeExamSummaries({
    summaries: merged,
    subject,
    sourceName: fileName,
  });

  return {
    fileName,
    chunkCount: chunks.length,
    brief: finalBrief,
  };
}

export async function generateExamPaper(options: GenerateExamPaperOptions) {
  try {
    const {
      userId,
      title,
      university,
      subject,
      template,
      duration,
      totalMarks,
      sections,
      documentIds,
      mode = "full",
    } = options;

    const safeTitle =
      title?.trim() ||
      (documentIds && documentIds.length > 0 ? "Document-Based Exam Paper" : "Untitled Exam");

    let documentContent = "";
    let totalChunkCount = 0;

    if (documentIds && documentIds.length > 0) {
      const documents = await prisma.document.findMany({
        where: {
          id: { in: documentIds },
          userId,
        },
      });

      if (documents.length > 0) {
        const sourceBriefs: string[] = [];

        for (const doc of documents) {
          try {
            const extractedText = await extractDocumentText(doc.fileUrl, doc.mimeType);
            const result = await buildDocumentExamBrief({
              fileName: doc.fileName,
              extractedText,
              subject,
              mode,
            });

            if (result?.brief) {
              sourceBriefs.push(`SOURCE: ${result.fileName}\n${result.brief}`);
              totalChunkCount += result.chunkCount;
            }
          } catch (error) {
            console.warn("Failed to extract document text:", doc.fileName, error);
          }
        }

        if (sourceBriefs.length > 0) {
          if (sourceBriefs.length === 1) {
            documentContent = `Use the following source material to craft the questions:\n${sourceBriefs[0]}`;
          } else {
            const mergedSources = await mergeExamSummaries({
              summaries: sourceBriefs,
              subject,
              sourceName: "Combined sources",
            });
            documentContent = `Use the following source material to craft the questions:\n${mergedSources}`;
          }
        } else {
          documentContent = `Generate questions appropriate for ${subject} at university level.`;
        }
      }
    } else {
      documentContent = `Generate questions appropriate for ${subject} at university level.`;
    }

    const userPrompt = `Create a university exam paper with the following specifications:

EXAM DETAILS:
- Title: ${safeTitle}
- University: ${university}
- Subject: ${subject}
- Duration: ${duration} minutes
- Total Marks: ${totalMarks}
- Template Style: ${template}

SECTIONS:
${sections
  .map(
    (s, i) => `
Section ${i + 1} - ${s.name}:
- Type: ${s.type}
- Number of questions: ${s.questionCount}
- Marks per question: ${s.marksPerQuestion}
- Instructions: ${s.instructions || "None"}
`
  )
  .join("\n")}

CONTENT CONTEXT:
${documentContent}

FORMAT REQUIREMENTS:
1. Professional university exam paper layout
2. Clear section headings
3. Question numbering (1, 2, 3... or 1a, 1b...)
4. Mark allocation shown after each question
5. Instructions for candidates at the top
6. Time and total marks clearly displayed

QUESTION QUALITY:
- Clear and specific wording
- Appropriate difficulty for university level
- Mix of theory, application, and analysis
- Avoid ambiguity
- Progressive difficulty within sections

Return a JSON object with this structure (no markdown, no backticks):
{
  "header": {
    "university": "${university}",
    "examTitle": "${safeTitle}",
    "subject": "${subject}",
    "duration": "${duration} minutes",
    "totalMarks": ${totalMarks},
    "instructions": ["Instruction 1", "Instruction 2"]
  },
  "sections": [
    {
      "name": "Section A",
      "instructions": "Answer all questions",
      "questions": [
        {
          "number": "1",
          "text": "Define data structure and explain its importance in computer science.",
          "marks": 5,
          "type": "short-answer"
        }
      ]
    }
  ]
}`;

    const response = await callGroq(userPrompt, EXAM_SYSTEM_PROMPT, 12000);

    const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const examData = JSON.parse(cleanedResponse);

    const examPaper = await prisma.examPaper.create({
      data: {
        userId,
        title: safeTitle,
        university,
        subject,
        template,
        duration,
        totalMarks,
        sections,
        questions: examData,
        answerKey: Prisma.JsonNull,
        pdfUrl: "",
      },
    });

    return {
      success: true,
      examPaper,
      chunkCount: totalChunkCount,
      mode,
    };
  } catch (error) {
    console.error("Exam paper generation error:", error);
    throw error;
  }
}
