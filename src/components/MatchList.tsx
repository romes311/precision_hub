"use client";

import { Match } from "@/types";
import { MatchCard } from "./MatchCard";

interface MatchListProps {
  matches: Match[];
  title?: string;
  emptyMessage?: string;
}

export function MatchList({
  matches,
  title,
  emptyMessage = "No matches found.",
}: MatchListProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted border-border rounded-lg border border-dashed py-8 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="bg-card border-border rounded-xl border p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between">
        {title && (
          <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
            {title}
          </h2>
        )}
        <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
          {matches.length} Matches
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
