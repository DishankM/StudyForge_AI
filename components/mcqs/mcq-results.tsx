"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
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
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 70) return "Good work!";
    if (percentage >= 60) return "Not bad, but you can do better!";
    return "Keep practicing!";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Quiz Completed!</h1>
          <p className="text-gray-400">Here is how you performed</p>
        </div>

        <Card className="mb-8 border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8">
          <div className="text-center">
            <div className={cn("mb-2 text-7xl font-bold", getScoreColor(scorePercentage))}>
              {scorePercentage}%
            </div>
            <p className="mb-4 text-2xl font-semibold">{getScoreMessage(scorePercentage)}</p>
            <p className="text-gray-400">
              {correctCount} out of {totalQuestions} questions correct
            </p>
          </div>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-white/10 bg-zinc-900 p-6">
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-400">Correct</span>
            </div>
            <p className="text-3xl font-bold text-green-500">{correctCount}</p>
          </Card>

          <Card className="border-white/10 bg-zinc-900 p-6">
            <div className="mb-2 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-400">Incorrect</span>
            </div>
            <p className="text-3xl font-bold text-red-500">{incorrectCount}</p>
          </Card>

          <Card className="border-white/10 bg-zinc-900 p-6">
            <div className="mb-2 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-400">Skipped</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{skippedCount}</p>
          </Card>

          <Card className="border-white/10 bg-zinc-900 p-6">
            <div className="mb-2 flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-400">Time</span>
            </div>
            <p className="text-3xl font-bold text-blue-500">{formatTime(timeElapsed)}</p>
          </Card>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <Button onClick={onRetry} className="bg-gradient-to-r from-pink-500 to-purple-600">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Quiz
          </Button>
          <Button variant="outline" onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-white/10 bg-zinc-900 p-6">
          <h2 className="mb-6 text-2xl font-bold">Review Answers</h2>
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
                    "rounded-lg border p-4 transition-all",
                    isCorrect && "border-green-500/30 bg-green-500/5",
                    !isCorrect && !wasSkipped && "border-red-500/30 bg-red-500/5",
                    wasSkipped && "border-yellow-500/30 bg-yellow-500/5"
                  )}
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="flex w-full items-start justify-between text-left"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      ) : wasSkipped ? (
                        <TrendingUp className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                      ) : (
                        <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">
                          Question {index + 1}: {question.question}
                        </p>
                        {wasSkipped && <p className="mt-1 text-sm text-yellow-500">Not answered</p>}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 pl-8">
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isCorrectAnswer = optionIndex === question.correctAnswer;
                          const wasSelected = answer.selectedAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={cn(
                                "rounded border p-3",
                                isCorrectAnswer && "border-green-500 bg-green-500/10",
                                wasSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                                !wasSelected && !isCorrectAnswer && "border-white/10"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
                                )}
                                {wasSelected && !isCorrectAnswer && (
                                  <XCircle className="ml-auto h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded border border-blue-500/20 bg-blue-500/10 p-4">
                        <p className="mb-1 text-sm font-semibold text-blue-400">Explanation:</p>
                        <p className="text-sm text-gray-300">{question.explanation}</p>
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
