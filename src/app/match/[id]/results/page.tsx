import { notFound } from "next/navigation";
import { getMatchResults } from "@/lib/api";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, CalendarDays, MapPin } from "lucide-react";
import moment from "moment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage(props: PageProps) {
  const params = await props.params;
  const matchId = parseInt(params.id, 10);

  if (isNaN(matchId)) {
    notFound();
  }

  const results = await getMatchResults(matchId);

  if (!results) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground mb-4 text-2xl font-bold">
            Results Not Found or Placeholder
          </h1>
          <p className="text-muted-foreground mb-6">
            We only have demo results for Match ID 1445 right now.
          </p>
          <Button asChild>
            <Link href="/">Back to Hub</Link>
          </Button>
        </div>
      </main>
    );
  }

  const { match, shooters } = results;
  const date = moment(match.startDate);

  return (
    <main className="bg-background min-h-screen pb-20">
      {/* Header Bar */}
      <div className="bg-card border-border border-b">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:bg-primary -ml-4 hover:text-black"
          >
            <Link href={match.clubId ? `/club/${match.clubId}` : "/"}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Match/Club
            </Link>
          </Button>
          <span className="text-foreground font-semibold">Match Results</span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Match Header */}
        <div className="bg-card border-l-primary border-border mb-8 rounded-lg border border-l-4 p-6 shadow-sm">
          <h1 className="text-foreground mb-2 text-3xl font-bold tracking-wide uppercase">
            {match.name}
          </h1>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <CalendarDays className="text-primary mr-2 h-4 w-4" />
              {date.format("MMMM D, YYYY")}
            </div>
            <div className="flex items-center">
              <MapPin className="text-primary mr-2 h-4 w-4" />
              {match.city}, {match.state}
            </div>
            <div>👥 {shooters.length} Shooters</div>
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard results={results} />
      </div>
    </main>
  );
}
