"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";

const testimonials = [
  {
    quote: "The notes gave me a much cleaner starting point before revision week.",
    name: "Rahul Sharma",
    course: "B.Tech CSE",
    university: "Delhi",
  },
  {
    quote: "I liked that I could move from notes to MCQs without uploading the same thing again.",
    name: "Ananya Patel",
    course: "MBBS",
    university: "Mumbai",
  },
  {
    quote: "The viva questions helped me think about how I would answer orally, not just in writing.",
    name: "Arjun Kumar",
    course: "BBA",
    university: "Delhi",
  },
  {
    quote: "The exam paper layout made revision feel more realistic before tests.",
    name: "Sneha Joshi",
    course: "Commerce",
    university: "Pune",
  },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Student-Focused by Design
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            The value of StudyForge is in helping students move from raw material to usable revision formats more quickly.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 transition-colors hover:border-primary-purple/30"
            >
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-primary-pink text-primary-pink" />
                ))}
              </div>
              <p className="mb-6 text-sm text-text-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-purple" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{testimonial.name}</span>
                    <BadgeCheck className="h-4 w-4 text-primary-purple" />
                  </div>
                  <p className="text-xs text-text-muted">
                    {testimonial.course}, {testimonial.university}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
