import { FileCheck, FileText, ListChecks, Mic } from "lucide-react";

const features = [
  {
    title: "Smart Notes Generation",
    icon: FileText,
    description: "Turn long material into short, structured notes that are easier to revise quickly.",
    benefits: ["Topic-wise structure", "Cleaner summaries", "Faster reading"],
  },
  {
    title: "Intelligent MCQ Creator",
    icon: ListChecks,
    description: "Create practice questions with explanations so revision can shift into self-testing fast.",
    benefits: ["Quick practice", "Answer context", "Repeatable prep"],
  },
  {
    title: "University Exam Papers",
    icon: FileCheck,
    description: "Generate formal question papers with sections, marks, and a more academic layout.",
    benefits: ["Exam-style format", "Mark distribution", "Download-ready"],
  },
  {
    title: "Viva Question Bank",
    icon: Mic,
    description: "Prepare for oral exams with focused viva questions pulled from the same source material.",
    benefits: ["Topic coverage", "Oral prep", "Useful before finals"],
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Core Tools for Faster Revision
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-secondary sm:text-lg">
            The homepage now focuses on the outputs students use most instead of stacking every possible workflow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-purple/30 sm:p-6 lg:p-8"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple sm:h-14 sm:w-14">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-text-primary sm:text-xl">{feature.title}</h3>
              <p className="mb-4 text-sm leading-6 text-text-secondary">{feature.description}</p>
              <ul className="space-y-1">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-pink" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
