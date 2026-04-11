export type PreparationLevel = "just-starting" | "somewhat-prepared" | "revision-mode";

export type UnitPlan = {
  unitName: string;
  importance: "High" | "Medium" | "Low";
  expectedWeightage: string;
  recommendedHours: number;
  whyItMatters: string;
  keyTopics: string[];
};

export type PriorityTopic = {
  topic: string;
  unit: string;
  importance: "High" | "Medium" | "Low";
  reason: string;
  revisionApproach: string;
};

export type StudyPhase = {
  phaseTitle: string;
  dateRange: string;
  goal: string;
  studyFocus: string[];
  outputTarget: string;
};

export type DailyTask = {
  dayLabel: string;
  dateLabel: string;
  focus: string;
  taskList: string[];
  hours: number;
};

export type RevisionRoadmap = {
  roadmapTitle: string;
  overview: string;
  examReadinessSummary: string;
  recommendedStrategy: string;
  unitCoverageSummary: string;
  likelyHighYieldAreas: string[];
  unitPlans: UnitPlan[];
  priorityTopics: PriorityTopic[];
  studyPhases: StudyPhase[];
  dailyPlan: DailyTask[];
  finalWeekChecklist: string[];
};

export function parseRevisionRoadmapJson(data: unknown): RevisionRoadmap | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (typeof o.roadmapTitle !== "string" || typeof o.overview !== "string") return null;
  return data as RevisionRoadmap;
}
