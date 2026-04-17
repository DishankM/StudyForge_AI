import { prisma } from "@/lib/prisma";
import { getPlanDetails, normalizePlan, type PlanId, type UsageFeature } from "@/lib/plans";

function getCurrentCycleStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

async function getUserPlan(userId: string): Promise<PlanId> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return normalizePlan(user?.plan);
}

export async function getUserUsageSnapshot(userId: string) {
  const cycleStart = getCurrentCycleStart();
  const plan = await getUserPlan(userId);

  const [uploads, notes, mcqs, viva, examPapers, roadmaps] = await Promise.all([
    prisma.document.count({
      where: {
        userId,
        uploadedAt: { gte: cycleStart },
      },
    }),
    prisma.note.count({
      where: {
        userId,
        createdAt: { gte: cycleStart },
      },
    }),
    prisma.mcqSet.count({
      where: {
        userId,
        createdAt: { gte: cycleStart },
      },
    }),
    prisma.document.count({
      where: {
        userId,
        vivaGeneratedAt: { gte: cycleStart },
      },
    }),
    prisma.examPaper.count({
      where: {
        userId,
        createdAt: { gte: cycleStart },
      },
    }),
    prisma.revisionRoadmap.count({
      where: {
        userId,
        createdAt: { gte: cycleStart },
      },
    }),
  ]);

  return {
    plan,
    cycleStart,
    usage: {
      uploads,
      notes,
      mcqs,
      viva,
      examPapers,
      roadmaps,
    },
  };
}

export async function getFeatureQuotaStatus(userId: string, feature: UsageFeature) {
  const snapshot = await getUserUsageSnapshot(userId);
  const planDetails = getPlanDetails(snapshot.plan);
  const limit = planDetails.limits[feature];
  const used = snapshot.usage[feature];

  return {
    ...snapshot,
    feature,
    used,
    limit,
    allowed: limit === null || used < limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
    planDetails,
  };
}

export async function enforceFeatureQuota(userId: string, feature: UsageFeature) {
  const status = await getFeatureQuotaStatus(userId, feature);

  if (!status.allowed) {
    const featureLabels: Record<UsageFeature, string> = {
      uploads: "document uploads",
      notes: "note generations",
      mcqs: "MCQ generations",
      viva: "viva generations",
      examPapers: "exam paper generations",
      roadmaps: "revision roadmaps",
    };

    throw new Error(
      `${status.planDetails.name} allows ${status.limit} ${featureLabels[feature]} per month. Upgrade your plan to continue.`
    );
  }

  return status;
}
