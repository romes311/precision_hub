"use client";

import { useState } from "react";
import { Match } from "@/types";
import { MatchCard } from "./MatchCard";

import Link from "next/link";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarButton } from "@/components/CalendarButton";

interface MatchListProps {
  matches: Match[];
  title?: string;
  emptyMessage?: string;
  layout?: "grid" | "list";
}

export function MatchList({
  matches,
  title,
  emptyMessage = "No matches found.",
  layout = "grid",
}: MatchListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(layout);

  if (!matches || matches.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted border-border rounded-lg border border-dashed py-8 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="bg-card border-border rounded-xl border p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {title && (
            <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
              {title}
            </h2>
          )}
          <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
            {matches.length} Matches
          </span>
        </div>

        <div className="bg-muted border-border flex items-center rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid View</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const date = moment.utc(match.startDate).tz("America/Denver");
            const isPast = date.isBefore(moment());
            const registerLink =
              match.url ||
              `https://www.impactscoring.net/match/register?id=${match.id}`;
            const resultLink = `/match/${match.id}/results`;

            const imageUrl =
              match.clubLogoImage?.previewUrl ||
              match.clubLogoImage?.thumbnailUrl ||
              match.logoImage?.previewUrl ||
              match.logoImage?.thumbnailUrl;

            return (
              <div
                key={match.id}
                className={`border-border bg-card hover:border-primary flex flex-col justify-between gap-4 rounded-lg border p-4 transition-all md:flex-row md:items-center ${isPast ? "opacity-70" : ""}`}
              >
                <div className="flex flex-1 items-center gap-4">
                  {/* Date Box */}
                  <div className="bg-muted border-border/50 flex h-[70px] min-w-[70px] flex-shrink-0 flex-col items-center justify-center rounded-md border p-1">
                    <span className="text-muted-foreground text-[10px] leading-tight font-bold uppercase">
                      {date.format("MMM")}
                    </span>
                    <span className="text-foreground my-0.5 text-xl leading-none font-extrabold">
                      {date.format("DD")}
                    </span>
                    <span className="text-muted-foreground text-[10px] leading-tight font-bold">
                      {date.format("YYYY")}
                    </span>
                  </div>

                  {/* Image (Hidden on very small screens if needed, but looks good) */}
                  {imageUrl && (
                    <div className="bg-muted border-border/50 hidden h-[70px] w-32 flex-shrink-0 overflow-hidden rounded-md border sm:block">
                      <img
                        src={imageUrl}
                        alt={match.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-foreground line-clamp-1 text-lg font-bold">
                        {match.name}
                      </h4>
                      {isPast && (
                        <Badge variant="secondary" className="h-5 text-[10px]">
                          Finished
                        </Badge>
                      )}
                    </div>

                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center whitespace-nowrap">
                        <CalendarDays className="mr-1 h-3.5 w-3.5" />
                        {date.format("h:mm A") === "12:00 AM"
                          ? date.format("dddd")
                          : date.format("dddd, h:mm A")}
                      </span>
                      <span className="flex items-center whitespace-nowrap">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        {match.city}, {match.state}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-2 w-full flex-shrink-0 md:mt-0 md:w-auto">
                  {isPast ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      <Link href={resultLink}>Results</Link>
                    </Button>
                  ) : (
                    <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                      <CalendarButton
                        event={{
                          title: match.name,
                          description: `Match: ${match.name}\nType: ${match.matchTypeReadableName}\nClub: ${
                            match.clubName || "N/A"
                          }`,
                          startDate: match.startDate,
                          location: `${match.city}, ${match.state}`,
                          url: registerLink,
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto"
                      />
                      <Button
                        asChild
                        size="sm"
                        className="w-full font-bold md:w-auto"
                      >
                        <Link href={registerLink} target="_blank">
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
