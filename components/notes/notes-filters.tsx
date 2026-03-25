"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function NotesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/dashboard/notes?${params.toString()}`);
  };

  const handleFormatChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("format", value);
    } else {
      params.delete("format");
    }
    router.push(`/dashboard/notes?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/dashboard/notes?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select defaultValue={searchParams.get("format") || "all"} onValueChange={handleFormatChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Formats</SelectItem>
          <SelectItem value="concise">Concise</SelectItem>
          <SelectItem value="detailed">Detailed</SelectItem>
          <SelectItem value="bullet-points">Bullet Points</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="title">Title A-Z</SelectItem>
          <SelectItem value="words">Most Words</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
