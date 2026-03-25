import Link from "next/link";
import { CheckCircle2, Mail, Share2, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-primary-pink/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-primary-pink" />
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary mb-4">
          You&apos;re on the list!
        </h1>
        <p className="text-text-secondary text-lg mb-12">
          Thanks for joining the StudyForge waitlist. We&apos;ll notify you as
          soon as we launch and send you early-access tips.
        </p>

        <div className="text-left space-y-6 mb-12">
          <h2 className="font-heading font-semibold text-xl text-text-primary">
            What happens next?
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-lg bg-primary-purple/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary-purple" />
              </span>
              <div>
                <p className="font-medium text-text-primary">Check your inbox</p>
                <p className="text-text-secondary text-sm">
                  We&apos;ve sent a confirmation to your email. Add us to your
                  contacts so you don&apos;t miss updates.
                </p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-lg bg-primary-purple/20 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4 text-primary-purple" />
              </span>
              <div>
                <p className="font-medium text-text-primary">Spread the word</p>
                <p className="text-text-secondary text-sm">
                  Share StudyForge with classmates. The more students who join,
                  the sooner we launch.
                </p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-lg bg-primary-purple/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-primary-purple" />
              </span>
              <div>
                <p className="font-medium text-text-primary">Explore the site</p>
                <p className="text-text-secondary text-sm">
                  Check out our features and pricing so you&apos;re ready when we
                  go live.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/">
              Back to home <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/#features">View features</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
