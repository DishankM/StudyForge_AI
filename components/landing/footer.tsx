"use client";

import Link from "next/link";
import { Instagram, Linkedin, MessageCircle, Twitter, Youtube } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Sample Outputs", href: "#demo" },
  ],
  resources: [
    { label: "Help Center", href: "#" },
    { label: "Study Tips", href: "#" },
    { label: "Revision Guides", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
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
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="font-heading text-xl font-bold gradient-text">
              StudyForge
            </Link>
            <p className="mt-2 text-sm text-text-muted">Turn study material into usable revision assets</p>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              A study workspace for students who want notes, practice, and exam preparation built from their own source material.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-text-muted transition-colors hover:border-primary-pink/30 hover:text-primary-pink"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-4 font-heading font-semibold capitalize text-text-primary">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary-pink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16">
          <div className="glass-card max-w-xl p-5 sm:p-6">
            <p className="mb-1 font-medium text-text-primary">Get study tips and platform updates</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-purple"
              />
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-primary-pink to-primary-purple px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-sm text-text-muted sm:text-left">© 2026 StudyForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-text-muted">EN</span>
            <span className="cursor-pointer text-xs text-text-muted">HI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
