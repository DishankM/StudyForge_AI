import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { extractDocumentText } from "@/lib/extractors";

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
    } = options;

    const safeTitle =
      title?.trim() ||
      (documentIds && documentIds.length > 0 ? "Document-Based Exam Paper" : "Untitled Exam");

    let documentContent = "";
    if (documentIds && documentIds.length > 0) {
      const documents = await prisma.document.findMany({
        where: {
          id: { in: documentIds },
          userId,
        },
      });

      if (documents.length > 0) {
        const extractedChunks: string[] = [];
        for (const doc of documents) {
          try {
            const extractedText = await extractDocumentText(doc.fileUrl, doc.mimeType);
            if (extractedText) {
              extractedChunks.push(
                `SOURCE: ${doc.fileName}\n${extractedText.trim()}`
              );
            }
          } catch (error) {
            console.warn("Failed to extract document text:", doc.fileName, error);
          }
        }

        const combinedText = extractedChunks.join("\n\n");
        if (combinedText.trim().length > 0) {
          const maxChars = 12000;
          documentContent = `Use the following source material to craft the questions:\n${combinedText.slice(
            0,
            maxChars
          )}`;
        } else {
          documentContent = `Generate questions appropriate for ${subject} at university level.`;
        }
      }
    } else {
      documentContent = `Generate questions appropriate for ${subject} at university level.`;
    }

    const systemPrompt = `You are an expert university exam paper setter. You create professional, well-formatted exam papers that:
- Follow university formatting standards
- Have clear, unambiguous questions
- Test various levels of understanding
- Include proper mark allocation
- Have appropriate difficulty distribution`;

    const userPrompt = `Create a university exam paper with the following specifications:

EXAM DETAILS:
- Title: ${safeTitle}
- University: ${university}
- Subject: ${subject}
- Duration: ${duration} minutes
- Total Marks: ${totalMarks}

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
    "instructions": ["Instruction 1", "Instruction 2", ...]
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

    const response = await callGroq(userPrompt, systemPrompt, 16000);

    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

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
        answerKey: null,
        pdfUrl: "",
      },
    });

    return {
      success: true,
      examPaper,
    };
  } catch (error) {
    console.error("Exam paper generation error:", error);
    throw error;
  }
}
