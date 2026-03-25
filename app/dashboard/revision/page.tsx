import { auth } from "@/lib/auth";
import { RevisionPlanner } from "@/components/revision/revision-planner";

export default async function RevisionPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revision Planner</h1>
        <p className="mt-2 text-gray-400">
          Create personalized study schedules based on your exam dates
        </p>
      </div>

      <RevisionPlanner userId={session!.user.id} />
    </div>
  );
}
