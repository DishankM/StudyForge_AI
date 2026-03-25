"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  useEffect(() => {
    if (!timerActive || showResults) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: optionIndex,
      isCorrect: optionIndex === currentQuestion.correctAnswer,
    };
    setAnswers(newAnswers);
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
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].marked = !newAnswers[currentQuestionIndex].marked;
    setAnswers(newAnswers);
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setShowResults(true);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };

  const answeredCount = answers.filter((a) => a.selectedAnswer !== null).length;
  const correctCount = answers.filter((a) => a.isCorrect === true).length;
  const markedCount = answers.filter((a) => a.marked).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  if (showResults) {
    return (
      <MCQResults
        questions={questions}
        answers={answers}
        timeElapsed={timeElapsed}
        onRetry={() => {
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
        }}
        onExit={() => router.push("/dashboard/mcqs")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-8">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{mcqSet.title}</h1>
              <p className="mt-1 text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeElapsed)}
                </span>
              </div>

              <div className="hidden items-center gap-4 text-sm sm:flex">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{answeredCount} answered</span>
                </div>
                {markedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-yellow-500" />
                    <span>{markedCount} marked</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/mcqs/${mcqSet.id}`)}
              >
                <Home className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Card className="border-white/10 bg-zinc-900 p-8">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-3 py-1 text-sm font-semibold">
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-sm text-gray-400">{currentQuestion.topic}</span>
                  </div>
                  <h2 className="text-2xl font-semibold leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkQuestion}
                  className={cn(currentAnswer.marked && "text-yellow-500")}
                >
                  <Flag className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 space-y-3">
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
                        "w-full rounded-lg border-2 p-4 text-left transition-all",
                        "hover:border-pink-500/50 hover:bg-pink-500/5",
                        isSelected && !showExplanation && "border-pink-500 bg-pink-500/10",
                        showCorrectAnswer && isCorrect && "border-green-500 bg-green-500/10",
                        showCorrectAnswer && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                        !isSelected && !showCorrectAnswer && "border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 font-semibold",
                            isSelected && !showExplanation && "border-pink-500 bg-pink-500 text-white",
                            showCorrectAnswer && isCorrect && "border-green-500 bg-green-500 text-white",
                            showCorrectAnswer && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                            !isSelected && !showCorrectAnswer && "border-white/20"
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showCorrectAnswer && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {showCorrectAnswer && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                  <h3 className="mb-2 font-semibold text-blue-400">Explanation:</h3>
                  <p className="leading-relaxed text-gray-300">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {!showExplanation ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={currentAnswer.selectedAnswer === null}
                      className="bg-gradient-to-r from-pink-500 to-purple-600"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <>
                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-gradient-to-r from-pink-500 to-purple-600"
                        >
                          Next Question
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleFinishQuiz}
                          className="bg-gradient-to-r from-green-500 to-emerald-600"
                        >
                          Finish Quiz
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-white/10 bg-zinc-900 p-6">
              <h3 className="mb-4 font-semibold">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
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
                        "relative aspect-square rounded-lg border-2 text-sm font-semibold transition-all",
                        isCurrent &&
                          "ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a0a]",
                        isAnswered && !isCurrent && "border-green-500 bg-green-500/20",
                        !isAnswered && !isCurrent && "border-white/20 hover:border-pink-500/50",
                        isMarked && "border-yellow-500 bg-yellow-500/20"
                      )}
                    >
                      {index + 1}
                      {isMarked && (
                        <Flag className="absolute right-0 top-0 h-3 w-3 text-yellow-500" />
                      )}
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
                  <div className="h-4 w-4 rounded border-2 border-white/20" />
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
    </div>
  );
}
