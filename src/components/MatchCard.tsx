"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import { Match } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Standard Button
import { CalendarDays, MapPin } from "lucide-react"; // Import Icons

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = moment(match.startDate);
    setIsPast(date.isBefore(moment()));
    setFormattedDate(date.format("MMM D, YYYY"));
    setIsMounted(true);
  }, [match.startDate]);

  // Link logic
  const resultLink = `/match/${match.id}/results`;
  const registerLink = match.url || `https://www.impactscoring.net/match/register?id=${match.id}`;

  const imageUrl =
    match.clubLogoImage?.previewUrl ||
    match.clubLogoImage?.thumbnailUrl ||
    match.logoImage?.previewUrl ||
    match.logoImage?.thumbnailUrl;

  return (
    <Card
      className={`border-border flex h-full flex-col overflow-hidden border transition-all ${isPast ? "opacity-60" : "hover:border-primary hover:shadow-md"} bg-[#1E1E1E]`}
    >
      {imageUrl && (
        <div className="bg-muted border-border/50 relative h-32 w-full border-b">
          <img
            src={imageUrl}
            alt={match.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="flex-1 p-4 pt-5">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-col">
            <span
              className={`mb-1 text-xs font-bold tracking-wider uppercase ${isPast ? "text-muted-foreground" : "text-primary"}`}
            >
              {isMounted ? formattedDate : "Loading..."}{" "}
              {isPast ? "(Finished)" : ""}
            </span>
            <h4 className="text-card-foreground mb-2 text-lg leading-tight font-bold">
              {match.name}
            </h4>
          </div>
          <Badge variant={isMounted && isPast ? "secondary" : "default"}>
            {match.matchTypeReadableName}
          </Badge>
        </div>

        <div className="text-muted-foreground mb-1 flex items-center text-sm">
          <CalendarDays className="mr-2 h-4 w-4" />
          {isMounted ? moment(match.startDate).format("h:mm A") : "--:--"}
        </div>
        <div className="text-muted-foreground flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4" />
          {match.city}, {match.state}
        </div>
      </CardContent>
      <CardFooter className="border-border border-t bg-transparent p-3">
        {isPast ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={resultLink}>View Results</Link>
          </Button>
        ) : (
          <Button asChild className="w-full font-bold">
            <Link href={registerLink} target="_blank">
              Register / Details
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
