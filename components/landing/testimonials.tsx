"use client";

import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    quote:
      "Went from 60% to 85% in one semester! The MCQ practice was a game-changer.",
    name: "Rahul Sharma",
    course: "B.Tech CSE",
    university: "IIT Delhi",
  },
  {
    quote:
      "Generated my entire semester's notes in 2 hours. Saved my life during exams!",
    name: "Ananya Patel",
    course: "MBBS",
    university: "AIIMS Mumbai",
  },
  {
    quote:
      "The exam papers look exactly like our university format. Best investment!",
    name: "Arjun Kumar",
    course: "BBA",
    university: "Delhi University",
  },
  {
    quote:
      "Used it for CA finals. The short notes were perfect for revision.",
    name: "Sneha Joshi",
    course: "CA Final",
    university: "ICAI",
  },
  {
    quote:
      "My grades improved by 20%. The viva questions helped me ace oral exams.",
    name: "Vikram Singh",
    course: "LLB",
    university: "NLU Bangalore",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-surface/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            Trusted by 10,000+ Students Across India
          </h2>
        </motion.div>

        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-hidden">
            <div
              className="flex gap-6 shrink-0 animate-marquee md:group-hover:[animation-play-state:paused]"
              style={{ width: "max-content" }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="glass-card p-6 w-[320px] shrink-0 snap-center group hover:border-primary-purple/30 transition-colors"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-5 h-5 fill-primary-pink text-primary-pink"
                      />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-purple" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary text-sm">
                          {t.name}
                        </span>
                        <BadgeCheck className="w-4 h-4 text-primary-purple" />
                      </div>
                      <p className="text-text-muted text-xs">
                        {t.course}, {t.university}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

