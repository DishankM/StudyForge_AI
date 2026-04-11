import { prisma } from "@/lib/prisma";
import { callGroq } from "@/lib/groq";
import { extractDocumentText } from "@/lib/extractors";
import { chunkDocumentText } from "./document-chunking";
import type {
  DailyTask,
  PreparationLevel,
  PriorityTopic,
  RevisionRoadmap,
  StudyPhase,
  UnitPlan,
} from "@/lib/types/revision-roadmap";

export type { RevisionRoadmap } from "@/lib/types/revision-roadmap";

export type GenerateRevisionRoadmapOptions = {
  userId: string;
  documentId?: string | null;
  subjectName: string;
  examDate: string;
  studyHoursPerDay: number;
  preparationLevel: PreparationLevel;
  syllabusText?: string;
  examPattern?: string;
  focusAreas?: string;
};

const REVISION_ROADMAP_SYSTEM_PROMPT = `You are StudyForge's exam strategy planner. You create beautiful, practical, student-friendly roadmaps for exam preparation.

Your output must:
- focus on what a student should study first, next, and last
- identify important units and high-yield topics from the source material
- distribute study effort realistically based on days left and available study hours
- sound clear, motivating, and exam-focused
- avoid generic filler and weak motivational fluff
- return valid JSON only`;

function cleanJsonResponse(response: string) {
  return response.replace(/```json|```/gi, "").trim();
}

async function summarizeSourceChunk({
  chunk,
  index,
  total,
  subjectName,
}: {
  chunk: string;
  index: number;
  total: number;
  subjectName: string;
}) {
  const prompt = `You are preparing an exam-planning brief from chunk ${index + 1} of ${total} for ${subjectName}.

SOURCE CHUNK:
${chunk}

Extract only what helps a student plan exam preparation:
- unit names or chapter groupings when visible
- important topics, definitions, processes, formulas, frameworks, and repeated themes
- topics that feel foundational or likely to carry marks
- practical cues about what should be studied early vs later

Return a compact structured study brief in plain text with bullet points.`;

  return callGroq(prompt, REVISION_ROADMAP_SYSTEM_PROMPT, 1200);
}

async function buildSourceBrief({
  rawText,
  subjectName,
}: {
  rawText: string;
  subjectName: string;
}) {
  const chunks = chunkDocumentText(rawText, {
    targetChunkChars: 3000,
    maxChunkChars: 3600,
  }).slice(0, 5);

  if (chunks.length === 0) {
    return "";
  }

  const summaries: string[] = [];
  for (let index = 0; index < chunks.length; index += 1) {
    summaries.push(
      await summarizeSourceChunk({
        chunk: chunks[index],
        index,
        total: chunks.length,
        subjectName,
      })
    );
  }

  return summaries.join("\n\n");
}

function buildFallbackDailyPlan({
  daysUntilExam,
  studyHoursPerDay,
  subjectName,
}: {
  daysUntilExam: number;
  studyHoursPerDay: number;
  subjectName: string;
}) {
  const entries: DailyTask[] = [];
  const totalDays = Math.min(Math.max(daysUntilExam, 3), 10);

  for (let index = 0; index < totalDays; index += 1) {
    entries.push({
      dayLabel: `Day ${index + 1}`,
      dateLabel: `Study day ${index + 1}`,
      focus:
        index < totalDays * 0.5
          ? "Core understanding"
          : index < totalDays - 2
          ? "Practice and revision"
          : "Final revision and recall",
      taskList: [
        `Study the highest-priority ${subjectName} topics for the day`,
        "Revise definitions, key processes, and likely long-answer concepts",
        "Test recall with self-questions or short written answers",
      ],
      hours: studyHoursPerDay,
    });
  }

  return entries;
}

export async function generateRevisionRoadmap({
  userId,
  documentId,
  subjectName,
  examDate,
  studyHoursPerDay,
  preparationLevel,
  syllabusText,
  examPattern,
  focusAreas,
}: GenerateRevisionRoadmapOptions) {
  const document = documentId
    ? await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
        },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          mimeType: true,
          subject: true,
          documentType: true,
        },
      })
    : null;

  if (documentId && !document) {
    throw new Error("Selected document not found");
  }

  const documentText = document
    ? await extractDocumentText(document.fileUrl, document.mimeType)
    : "";

  const sourceText = [syllabusText?.trim(), documentText.trim()].filter(Boolean).join("\n\n");

  if (!sourceText) {
    throw new Error("Add a syllabus or choose a document to build the roadmap");
  }

  const examDateValue = new Date(examDate);
  const today = new Date();
  const msRemaining = examDateValue.getTime() - today.getTime();
  const daysUntilExam = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const sourceBrief = await buildSourceBrief({ rawText: sourceText, subjectName });

  const prompt = `Create a structured exam roadmap for this student.

STUDENT CONTEXT:
- Subject: ${subjectName}
- Exam date: ${examDate}
- Days left: ${daysUntilExam}
- Study hours per day: ${studyHoursPerDay}
- Preparation level: ${preparationLevel}
- Exam pattern: ${examPattern?.trim() || "Not specified"}
- Special focus areas: ${focusAreas?.trim() || "Not specified"}

SOURCE DOCUMENT CONTEXT:
- Selected document name: ${document?.fileName || "No uploaded document selected"}
- Selected document type: ${document?.documentType || "Not specified"}

SOURCE BRIEF:
${sourceBrief || sourceText.slice(0, 9000)}

Build a roadmap that helps the student understand:
- which units or topic groups are most important
- what is likely high-yield for the exam
- how to divide preparation across the days left
- what to study first, next, and in the final revision window

Return JSON with this exact shape:
{
  "roadmapTitle": "string",
  "overview": "string",
  "examReadinessSummary": "string",
  "recommendedStrategy": "string",
  "unitCoverageSummary": "string",
  "likelyHighYieldAreas": ["string"],
  "unitPlans": [
    {
      "unitName": "string",
      "importance": "High" | "Medium" | "Low",
      "expectedWeightage": "string",
      "recommendedHours": number,
      "whyItMatters": "string",
      "keyTopics": ["string"]
    }
  ],
  "priorityTopics": [
    {
      "topic": "string",
      "unit": "string",
      "importance": "High" | "Medium" | "Low",
      "reason": "string",
      "revisionApproach": "string"
    }
  ],
  "studyPhases": [
    {
      "phaseTitle": "string",
      "dateRange": "string",
      "goal": "string",
      "studyFocus": ["string"],
      "outputTarget": "string"
    }
  ],
  "dailyPlan": [
    {
      "dayLabel": "string",
      "dateLabel": "string",
      "focus": "string",
      "taskList": ["string"],
      "hours": number
    }
  ],
  "finalWeekChecklist": ["string"]
}

Rules:
- Keep the roadmap realistic for ${daysUntilExam} days and ${studyHoursPerDay} study hours per day.
- Prefer 3 to 6 unit plans.
- Prefer 5 to 8 priority topics.
- Prefer 3 to 4 study phases.
- Prefer up to 10 dailyPlan items, grouping days if needed.
- Make the advice feel exam-smart, not generic.
- Return JSON only.`;

  const response = await callGroq(prompt, REVISION_ROADMAP_SYSTEM_PROMPT, 5000);
  const parsed = JSON.parse(cleanJsonResponse(response)) as Partial<RevisionRoadmap>;

  const roadmap: RevisionRoadmap = {
    roadmapTitle: parsed.roadmapTitle || `${subjectName} Exam Roadmap`,
    overview:
      parsed.overview ||
      `A focused plan for ${subjectName} built around your available time and source material.`,
    examReadinessSummary:
      parsed.examReadinessSummary ||
      `You have ${daysUntilExam} day${daysUntilExam === 1 ? "" : "s"} to prepare, so the roadmap prioritizes high-yield coverage first.`,
    recommendedStrategy:
      parsed.recommendedStrategy ||
      "Cover the highest-value units first, then move into practice-heavy revision and final recall.",
    unitCoverageSummary:
      parsed.unitCoverageSummary ||
      "The roadmap balances core units, quick wins, and final revision based on your available preparation window.",
    likelyHighYieldAreas: parsed.likelyHighYieldAreas?.filter(Boolean) || [],
    unitPlans: (parsed.unitPlans || []).filter(Boolean) as UnitPlan[],
    priorityTopics: (parsed.priorityTopics || []).filter(Boolean) as PriorityTopic[],
    studyPhases: (parsed.studyPhases || []).filter(Boolean) as StudyPhase[],
    dailyPlan: (() => {
      const fromParsed = (parsed.dailyPlan || []).filter(Boolean) as DailyTask[];
      if (fromParsed.length > 0) return fromParsed;
      return buildFallbackDailyPlan({ daysUntilExam, studyHoursPerDay, subjectName });
    })(),
    finalWeekChecklist: parsed.finalWeekChecklist?.filter(Boolean) || [],
  };

  if (roadmap.dailyPlan.length === 0) {
    roadmap.dailyPlan = buildFallbackDailyPlan({ daysUntilExam, studyHoursPerDay, subjectName });
  }

  return {
    success: true,
    roadmap,
    document: document
      ? {
          id: document.id,
          fileName: document.fileName,
          subject: document.subject,
        }
      : null,
    daysUntilExam,
  };
}
