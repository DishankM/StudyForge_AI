"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { addDays, differenceInDays, format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  examDate: Date;
  hoursPerDay: number;
  priority: "high" | "medium" | "low";
}

export function RevisionPlanner({ userId }: { userId: string }) {
  void userId;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [plan, setPlan] = useState<
    { date: Date; entries: { subject: string; hours: number; priority: Subject["priority"] }[] }[]
  >([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    examDate: undefined as Date | undefined,
    hoursPerDay: 2,
    priority: "medium" as "high" | "medium" | "low",
  });

  const addSubject = () => {
    if (!newSubject.name || !newSubject.examDate) return;

    setSubjects([
      ...subjects,
      {
        id: Date.now().toString(),
        name: newSubject.name,
        examDate: newSubject.examDate,
        hoursPerDay: newSubject.hoursPerDay,
        priority: newSubject.priority,
      },
    ]);

    setNewSubject({
      name: "",
      examDate: undefined,
      hoursPerDay: 2,
      priority: "medium",
    });
    setShowForm(false);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const generatePlan = () => {
    const today = startOfDay(new Date());
    const planMap = new Map<
      string,
      { date: Date; entries: { subject: string; hours: number; priority: Subject["priority"] }[] }
    >();

    subjects.forEach((subject) => {
      const examDate = startOfDay(subject.examDate);
      if (examDate < today) return;

      const totalDays = differenceInDays(examDate, today) + 1;
      for (let i = 0; i < totalDays; i += 1) {
        const date = addDays(today, i);
        const key = date.toISOString().slice(0, 10);
        const existing = planMap.get(key);
        const entry = {
          subject: subject.name,
          hours: subject.hoursPerDay,
          priority: subject.priority,
        };

        if (existing) {
          existing.entries.push(entry);
        } else {
          planMap.set(key, { date, entries: [entry] });
        }
      }
    });

    const planData = Array.from(planMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    setPlan(planData);
  };

  const getDaysUntil = (date: Date) => {
    return Math.max(0, differenceInDays(date, new Date()));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "low":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card className="border-white/10 bg-zinc-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">Add Subject</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Data Structures"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Exam Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-2 w-full justify-start text-left font-normal",
                      !newSubject.examDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newSubject.examDate ? format(newSubject.examDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-white/10 bg-zinc-900 p-0">
                  <Calendar
                    mode="single"
                    selected={newSubject.examDate}
                    onSelect={(date) => setNewSubject({ ...newSubject, examDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="hours">Study Hours/Day</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="12"
                value={newSubject.hoursPerDay}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    hoursPerDay: parseInt(e.target.value),
                  })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label>Priority</Label>
              <div className="mt-2 flex gap-2">
                {"high,medium,low".split(",").map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={newSubject.priority === priority ? "default" : "outline"}
                    onClick={() =>
                      setNewSubject({
                        ...newSubject,
                        priority: priority as any,
                      })
                    }
                    className="flex-1 capitalize"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={addSubject}>Add Subject</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-pink-500 to-purple-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      )}

      {subjects.length > 0 && (
        <Card className="border-white/10 bg-zinc-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">Your Subjects</h2>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const daysLeft = getDaysUntil(subject.examDate);
              return (
                <div
                  key={subject.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-800/50 p-4"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold">{subject.name}</h3>
                      <span className={cn("rounded px-2 py-1 text-xs capitalize", getPriorityColor(subject.priority))}>
                        {subject.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>Exam: {format(subject.examDate, "MMM dd, yyyy")}</span>
                      <span>{subject.hoursPerDay}h/day</span>
                      <span
                        className={cn(
                          "font-semibold",
                          daysLeft <= 7
                            ? "text-red-500"
                            : daysLeft <= 14
                            ? "text-yellow-500"
                            : "text-green-500"
                        )}
                      >
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeSubject(subject.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button onClick={generatePlan} className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600">
            Generate Revision Plan
          </Button>
        </Card>
      )}

      {subjects.length > 0 && (
        <Card className="border-white/10 bg-zinc-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">Study Calendar</h2>
          {plan.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <CalendarIcon className="mx-auto mb-4 h-16 w-16" />
              <p>Click "Generate Revision Plan" to see your daily schedule</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plan.map((day) => {
                const totalHours = day.entries.reduce((sum, entry) => sum + entry.hours, 0);
                return (
                  <div
                    key={day.date.toISOString()}
                    className="rounded-lg border border-white/10 bg-zinc-800/50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{format(day.date, "EEE, MMM dd")}</p>
                      <span className="text-sm text-gray-400">{totalHours}h total</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {day.entries.map((entry, index) => (
                        <span
                          key={`${entry.subject}-${index}`}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs",
                            getPriorityColor(entry.priority)
                          )}
                        >
                          {entry.subject} · {entry.hours}h
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
