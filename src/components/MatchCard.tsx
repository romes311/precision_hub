"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment-timezone";
import { Match } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Standard Button
import { CalendarDays, MapPin } from "lucide-react"; // Import Icons
import { CalendarButton } from "@/components/CalendarButton";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = moment.utc(match.startDate).tz("America/Denver");
    setIsPast(date.isBefore(moment()));
    setFormattedDate(date.format("MMM D, YYYY"));
    setIsMounted(true);
  }, [match.startDate]);

  // Link logic
  const resultLink = `/match/${match.id}/results`;
  const registerLink =
    match.url || `https://www.impactscoring.net/match/register?id=${match.id}`;

  const imageUrl =
    match.clubLogoImage?.previewUrl ||
    match.clubLogoImage?.thumbnailUrl ||
    match.logoImage?.previewUrl ||
    match.logoImage?.thumbnailUrl;

  return (
    <Card
      className={`border-border flex h-full flex-col gap-0 overflow-hidden border p-0 transition-all ${isPast ? "opacity-60" : "hover:border-primary hover:shadow-md"} bg-[#1E1E1E]`}
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
      <CardContent className={`flex-1 p-4 ${imageUrl ? "pt-5" : "pt-4"}`}>
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

        {isMounted && moment.utc(match.startDate).tz("America/Denver").format("h:mm A") !== "12:00 AM" && (
          <div className="text-muted-foreground mb-1 flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            {moment.utc(match.startDate).tz("America/Denver").format("h:mm A")}
          </div>
        )}
        <div className="text-muted-foreground flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4" />
          {match.city}, {match.state}
        </div>
      </CardContent>
      <CardFooter className="border-border border-t p-6">
        {isPast ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={resultLink}>View Results</Link>
          </Button>
        ) : (
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <CalendarButton
              event={{
                title: match.name,
                description: `Match: ${match.name}\nType: ${match.matchTypeReadableName}\nClub: ${match.clubName || "N/A"}`,
                startDate: match.startDate,
                location: `${match.city}, ${match.state}`,
                url: registerLink,
              }}
              variant="outline"
              className="flex-1"
            />
            <Button asChild className="flex-1 font-bold">
              <Link href={registerLink} target="_blank">
                Register
              </Link>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
