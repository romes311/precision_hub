"use client";

import { useState } from "react";
import { Match } from "@/types";
import { MatchCard } from "./MatchCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  if (!matches || matches.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted border-border rounded-lg border border-dashed py-8 text-center">
        {emptyMessage}
      </div>
    );
  }

  // Sort matches: upcoming first, then past.
  // Assuming 'matches' might be mixed or pre-sorted.
  // Let's rely on the passed order or enforce upcoming first if needed.
  // Usually API handles this, but let's ensure visuals are good.

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

      <div
        className={`relative transition-all duration-500 ease-in-out ${!isExpanded ? "max-h-[600px] overflow-hidden" : ""}`}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {!isExpanded && (
          <div className="from-card pointer-events-none absolute bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t to-transparent pb-8" />
        )}
      </div>

      <div
        className={`flex justify-center ${isExpanded ? "mt-6" : "relative z-10 -mt-12"}`}
      >
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-primary text-primary hover:bg-primary/10 hover:text-primary bg-card/80 min-w-[150px] backdrop-blur-sm"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              See All Matches <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
