import { getClubs, getMatches } from "@/lib/api";
import { ClubCard } from "@/components/ClubCard";
import { MatchList } from "@/components/MatchList";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  searchParams: Promise<{ source?: string }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const sourceFilter = searchParams.source || "IMPACT"; // Default to IMPACT

  const allMatches = await getMatches();

  // Filter based on source
  const matches = allMatches.filter(m => m.source === sourceFilter);

  // Filter for upcoming matches only
  const upcomingMatches = matches
    .filter((match) => new Date(match.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const getTitle = () => {
    if (sourceFilter === "PRS") return "PRS Series Matches";
    return "NRL22 / Impact Matches";
  }

  return (
    <main className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-card border-border text-card-foreground border-b py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-primary mb-4 text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
            Utah Rifle Shooting Hub
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
            Your central source for verified NRL22 and precision rimfire matches across Utah.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-6xl px-4">
        {/* Matches Section */}
        <div className="mb-12">
          <MatchList
            matches={upcomingMatches}
            title={getTitle()}
            emptyMessage="No upcoming matches scheduled."
          />
        </div>
      </div>
    </main>
  );
}
