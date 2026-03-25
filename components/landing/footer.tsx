"use client";

import Link from "next/link";
import {
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Universities Supported", href: "#" },
    { label: "API Documentation", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Student Success Stories", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Video Tutorials", href: "#" },
    { label: "Sample Outputs", href: "#" },
    { label: "Study Tips", href: "#" },
    { label: "Exam Prep Guides", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Partnership", href: "#" },
    { label: "Affiliate Program", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Academic Integrity", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="font-heading font-bold text-xl gradient-text">
              StudyForge
            </Link>
            <p className="text-text-muted text-sm mt-2">
              Transform studying into success
            </p>
            <p className="text-text-secondary text-sm mt-2 max-w-xs">
              AI-powered platform trusted by thousands of students to ace their
              exams with smart study materials.
            </p>
            <div className="flex gap-3 mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-primary-pink hover:border-primary-pink/30 transition-colors"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="resources">
            <h4 className="font-heading font-semibold text-text-primary mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="glass-card p-6 max-w-xl">
            <p className="font-medium text-text-primary mb-1">
              Get study tips & platform updates
            </p>
            <div className="flex gap-2 mt-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-pink to-primary-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </div>
            <p className="text-text-muted text-xs mt-2">
              Join 5,000+ subscribers
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © 2024 StudyForge. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-text-muted text-xs">EN</span>
            <span className="text-text-muted text-xs cursor-pointer">HI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
