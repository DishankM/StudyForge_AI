"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Home,
  Menu,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MCQResults } from "./mcq-results";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  topic: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  marked: boolean;
}

export function MCQPracticeInterface({ mcqSet }: { mcqSet: any }) {
  const router = useRouter();
  const questions: Question[] = mcqSet.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: null,
      isCorrect: null,
      marked: false,
    }))
  );
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  useEffect(() => {
    if (!timerActive || showResults) return;

    const interval = window.setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerActive, showResults]);

  useEffect(() => {
    setShowPalette(false);
  }, [currentQuestionIndex, showExplanation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;

    const nextAnswers = [...answers];
    nextAnswers[currentQuestionIndex] = {
      ...nextAnswers[currentQuestionIndex],
      selectedAnswer: optionIndex,
      isCorrect: optionIndex === currentQuestion.correctAnswer,
    };
    setAnswers(nextAnswers);
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer.selectedAnswer === null) return;
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkQuestion = () => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestionIndex].marked = !nextAnswers[currentQuestionIndex].marked;
    setAnswers(nextAnswers);
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setShowResults(true);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };

  const resetQuiz = () => {
    setAnswers(
      questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: null,
        isCorrect: null,
        marked: false,
      }))
    );
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setTimeElapsed(0);
    setTimerActive(true);
    setShowExplanation(false);
    setShowPalette(false);
  };

  const answeredCount = answers.filter((a) => a.selectedAnswer !== null).length;
  const markedCount = answers.filter((a) => a.marked).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  const hasNextQuestion = currentQuestionIndex < questions.length - 1;

  if (showResults) {
    return (
      <MCQResults
        questions={questions}
        answers={answers}
        timeElapsed={timeElapsed}
        onRetry={resetQuiz}
        onExit={() => router.push("/dashboard/mcqs")}
      />
    );
  }

  const primaryActionButton = !showExplanation ? (
    <Button
      onClick={handleSubmitAnswer}
      disabled={currentAnswer.selectedAnswer === null}
      className="min-h-11 w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto"
    >
      Submit Answer
    </Button>
  ) : hasNextQuestion ? (
    <Button
      onClick={handleNextQuestion}
      className="min-h-11 w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto"
    >
      Next Question
      <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <Button
      onClick={handleFinishQuiz}
      className="min-h-11 w-full bg-gradient-to-r from-green-500 to-emerald-600 sm:w-auto"
    >
      Finish Quiz
    </Button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-28 sm:pb-8">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{mcqSet.title}</h1>
                <p className="mt-1 text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 sm:px-4">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="font-mono text-sm font-semibold sm:text-lg">{formatTime(timeElapsed)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => router.push(`/dashboard/mcqs/${mcqSet.id}`)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Exit
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowPalette((current) => !current)}
                  aria-label="Toggle question palette"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Answered</p>
                <p className="mt-1 text-lg font-semibold text-white">{answeredCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Marked</p>
                <p className="mt-1 text-lg font-semibold text-white">{markedCount}</p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:block">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Difficulty</p>
                <p className="mt-1 truncate text-sm font-semibold text-white">{currentQuestion.difficulty}</p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:block">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Topic</p>
                <p className="mt-1 truncate text-sm font-semibold text-white">{currentQuestion.topic}</p>
              </div>
            </div>

            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-400 sm:hidden">
              {currentQuestion.difficulty} • {currentQuestion.topic}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-100 sm:text-sm sm:normal-case sm:tracking-normal">
                      {currentQuestion.difficulty}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400 sm:text-sm">
                      {currentQuestion.topic}
                    </span>
                  </div>
                  <h2 className="text-[1.05rem] font-semibold leading-8 text-white sm:text-2xl sm:leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMarkQuestion}
                  className={cn(
                    "rounded-2xl border border-white/10 bg-white/[0.03]",
                    currentAnswer.marked && "text-yellow-400"
                  )}
                >
                  <Flag className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = currentAnswer.selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrectAnswer = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={cn(
                        "w-full rounded-2xl border-2 p-3.5 text-left transition-all sm:p-5",
                        "hover:border-pink-500/50 hover:bg-pink-500/5",
                        isSelected && !showExplanation && "border-pink-500 bg-pink-500/10",
                        showCorrectAnswer && isCorrect && "border-green-500 bg-green-500/10",
                        showCorrectAnswer && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                        !isSelected && !showCorrectAnswer && "border-white/10 bg-white/[0.02]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold sm:h-10 sm:w-10",
                            isSelected && !showExplanation && "border-pink-500 bg-pink-500 text-white",
                            showCorrectAnswer && isCorrect && "border-green-500 bg-green-500 text-white",
                            showCorrectAnswer && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                            !isSelected && !showCorrectAnswer && "border-white/20 text-gray-300"
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                          <span className="flex-1 text-[15px] leading-7 text-white sm:text-base">{option}</span>
                          {showCorrectAnswer && isCorrect && (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          )}
                          {showCorrectAnswer && isSelected && !isCorrect && (
                            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 sm:p-5">
                  <h3 className="mb-2 font-semibold text-blue-400">Explanation</h3>
                  <p className="text-sm leading-7 text-gray-300 sm:text-base">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="min-h-11 flex-1 sm:flex-none"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11 flex-1 sm:hidden"
                    onClick={() => router.push(`/dashboard/mcqs/${mcqSet.id}`)}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Exit
                  </Button>
                </div>
                <div className="hidden sm:block">{primaryActionButton}</div>
              </div>
            </Card>
          </div>

          <div className={cn("lg:col-span-1", showPalette ? "block" : "hidden lg:block")}>
            <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:sticky lg:top-24">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Question Palette</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowPalette(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
                {questions.map((_, index) => {
                  const answer = answers[index];
                  const isAnswered = answer.selectedAnswer !== null;
                  const isMarked = answer.marked;
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={cn(
                        "relative aspect-square rounded-xl border-2 text-sm font-semibold transition-all",
                        isCurrent && "ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]",
                        isAnswered && !isCurrent && "border-green-500 bg-green-500/20",
                        !isAnswered && !isCurrent && "border-white/20 bg-white/[0.03] hover:border-pink-500/50",
                        isMarked && "border-yellow-500 bg-yellow-500/20"
                      )}
                    >
                      {index + 1}
                      {isMarked && <Flag className="absolute right-0 top-0 h-3 w-3 text-yellow-500" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-500/20" />
                  <span className="text-gray-400">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-white/20 bg-white/[0.03]" />
                  <span className="text-gray-400">Not answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-yellow-500 bg-yellow-500/20" />
                  <span className="text-gray-400">Marked for review</span>
                </div>
              </div>

              <Button onClick={handleFinishQuiz} variant="outline" className="mt-6 w-full">
                Finish Quiz
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0a]/95 p-3 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-7xl gap-2">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="min-h-11 flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex-[1.35]">{primaryActionButton}</div>
        </div>
      </div>
    </div>
  );
}
