"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name || "User";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideOnRoute =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin");

  if (hideOnRoute) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold gradient-text sm:text-xl">
              StudyForge
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="default" size="lg" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full ring-offset-background transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-violet"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session?.user?.image || ""} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-white/10 bg-surface/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-4 px-4 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 font-medium text-text-secondary hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn ? (
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button variant="default" className="w-full" size="lg" asChild>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      Start Free Trial
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
