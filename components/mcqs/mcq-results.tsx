"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Home,
  RotateCcw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MCQResults({
  questions,
  answers,
  timeElapsed,
  onRetry,
  onExit,
}: {
  questions: any[];
  answers: any[];
  timeElapsed: number;
  onRetry: () => void;
  onExit: () => void;
}) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const correctCount = answers.filter((a) => a.isCorrect === true).length;
  const incorrectCount = answers.filter((a) => a.isCorrect === false).length;
  const skippedCount = answers.filter((a) => a.selectedAnswer === null).length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleQuestion = (index: number) => {
    const nextExpanded = new Set(expandedQuestions);
    if (nextExpanded.has(index)) {
      nextExpanded.delete(index);
    } else {
      nextExpanded.add(index);
    }
    setExpandedQuestions(nextExpanded);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding";
    if (percentage >= 80) return "Great job";
    if (percentage >= 70) return "Good work";
    if (percentage >= 60) return "Solid attempt";
    return "Keep practicing";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:mb-8 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_32%)]" />
          <div className="relative text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Quiz Completed</h1>
            <p className="mt-2 text-sm text-gray-400 sm:text-base">Here is how you performed</p>

            <div className={cn("mt-6 text-6xl font-bold sm:text-7xl", getScoreColor(scorePercentage))}>
              {scorePercentage}%
            </div>
            <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{getScoreMessage(scorePercentage)}</p>
            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              {correctCount} out of {totalQuestions} questions correct
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 md:grid-cols-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-950/80 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-400">Correct</span>
            </div>
            <p className="text-2xl font-bold text-green-500 sm:text-3xl">{correctCount}</p>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-950/80 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-400">Incorrect</span>
            </div>
            <p className="text-2xl font-bold text-red-500 sm:text-3xl">{incorrectCount}</p>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-950/80 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-400">Skipped</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500 sm:text-3xl">{skippedCount}</p>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-950/80 p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-400">Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-500 sm:text-3xl">{formatTime(timeElapsed)}</p>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:justify-center">
          <Button onClick={onRetry} className="bg-gradient-to-r from-pink-500 to-purple-600">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Quiz
          </Button>
          <Button variant="outline" onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Review Answers</h2>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers[index];
              const isExpanded = expandedQuestions.has(index);
              const isCorrect = answer.isCorrect;
              const wasSkipped = answer.selectedAnswer === null;

              return (
                <div
                  key={question.id}
                  className={cn(
                    "rounded-2xl border p-4 transition-all sm:p-5",
                    isCorrect && "border-green-500/30 bg-green-500/5",
                    !isCorrect && !wasSkipped && "border-red-500/30 bg-red-500/5",
                    wasSkipped && "border-yellow-500/30 bg-yellow-500/5"
                  )}
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      ) : wasSkipped ? (
                        <TrendingUp className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                      ) : (
                        <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">
                          Question {index + 1}: {question.question}
                        </p>
                        {wasSkipped && <p className="mt-1 text-sm text-yellow-400">Not answered</p>}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 sm:pl-8">
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isCorrectAnswer = optionIndex === question.correctAnswer;
                          const wasSelected = answer.selectedAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={cn(
                                "rounded-xl border p-3",
                                isCorrectAnswer && "border-green-500 bg-green-500/10",
                                wasSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                                !wasSelected && !isCorrectAnswer && "border-white/10 bg-white/[0.02]"
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-white">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="flex-1 text-sm text-gray-200 sm:text-base">{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                                )}
                                {wasSelected && !isCorrectAnswer && (
                                  <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                        <p className="mb-1 text-sm font-semibold text-blue-400">Explanation</p>
                        <p className="text-sm leading-7 text-gray-300">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
