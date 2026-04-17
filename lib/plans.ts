export type PlanId = "FREE" | "STUDENT_PRO" | "INSTITUTE";

export type UsageFeature =
  | "uploads"
  | "notes"
  | "mcqs"
  | "viva"
  | "examPapers"
  | "roadmaps";

export type UsageLimit = number | null;

export const PLAN_ORDER: PlanId[] = ["FREE", "STUDENT_PRO", "INSTITUTE"];

export const PLAN_DETAILS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    price: string;
    period: string;
    badge: string;
    note?: string;
    cta: string;
    href: string;
    popular?: boolean;
    summary: string;
    accentClass: string;
    limits: Record<UsageFeature, UsageLimit>;
    features: string[];
  }
> = {
  FREE: {
    id: "FREE",
    name: "Free",
    price: "Rs 0",
    period: "/month",
    badge: "Starter limits for trying the workflow",
    cta: "Start Free",
    href: "/auth/signup",
    summary: "Best for trying uploads, notes, MCQs, and a single premium workflow.",
    accentClass: "from-slate-400 via-slate-200 to-white",
    limits: {
      uploads: 3,
      notes: 2,
      mcqs: 3,
      viva: 1,
      examPapers: 1,
      roadmaps: 1,
    },
    features: [
      "3 document uploads per month",
      "2 note generations per month",
      "3 MCQ sets per month",
      "1 viva, exam paper, and roadmap each month",
    ],
  },
  STUDENT_PRO: {
    id: "STUDENT_PRO",
    name: "Student Pro",
    price: "Rs 149",
    period: "/month",
    badge: "Most practical for regular study use",
    cta: "Start Free Trial",
    href: "/auth/signup",
    popular: true,
    note: "7-day free trial, cancel anytime",
    summary: "Built for daily revision, repeated generation, and serious exam prep.",
    accentClass: "from-pink-500 via-fuchsia-400 to-violet-500",
    limits: {
      uploads: 30,
      notes: 20,
      mcqs: 30,
      viva: 12,
      examPapers: 8,
      roadmaps: 8,
    },
    features: [
      "Higher monthly usage across all study tools",
      "Daily notes, MCQs, viva, exam paper, and roadmap support",
      "Priority access to the full study workflow",
      "Best value for individual students",
    ],
  },
  INSTITUTE: {
    id: "INSTITUTE",
    name: "Institute",
    price: "Custom",
    period: " pricing",
    badge: "For coaching centers, colleges, and teams",
    cta: "Contact Sales",
    href: "#contact",
    summary: "For shared access, admin oversight, and larger academic operations.",
    accentClass: "from-cyan-400 via-sky-300 to-emerald-300",
    limits: {
      uploads: null,
      notes: null,
      mcqs: null,
      viva: null,
      examPapers: null,
      roadmaps: null,
    },
    features: [
      "Everything in Student Pro",
      "Shared access for multiple students and faculty",
      "Admin workflows, onboarding, and custom support",
      "Custom usage volumes and operational setup",
    ],
  },
};

export function normalizePlan(plan?: string | null): PlanId {
  if (plan === "STUDENT_PRO" || plan === "INSTITUTE") {
    return plan;
  }

  return "FREE";
}

export function getPlanDetails(plan?: string | null) {
  return PLAN_DETAILS[normalizePlan(plan)];
}

export function getPlanDisplayName(plan?: string | null) {
  return getPlanDetails(plan).name;
}

export function formatUsageLimit(limit: UsageLimit) {
  return limit === null ? "Custom" : `${limit}/month`;
}

export function formatUsageValue(used: number, limit: UsageLimit) {
  return limit === null ? `${used} used` : `${used} / ${limit}`;
}

export function getUsageProgress(used: number, limit: UsageLimit) {
  if (limit === null || limit <= 0) {
    return 8;
  }

  return Math.max(8, Math.min(100, Math.round((used / limit) * 100)));
}
