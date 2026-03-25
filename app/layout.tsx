import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "StudyForge - AI Study Materials Generator | Notes, MCQs, Exam Papers",
  description:
    "Transform PDFs and lectures into exam-ready content. Generate notes, MCQs, viva questions, and university exam papers with AI in seconds.",
  keywords: [
    "AI study tool",
    "exam preparation",
    "notes generator",
    "MCQ maker",
    "study materials",
  ],
  openGraph: {
    title:
      "StudyForge - AI Study Materials Generator | Notes, MCQs, Exam Papers",
    description:
      "Transform PDFs and lectures into exam-ready content. Generate notes, MCQs, viva questions, and university exam papers with AI in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyForge - AI Study Materials Generator",
    description:
      "Transform PDFs and lectures into exam-ready content with AI in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <body className="font-sans min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
