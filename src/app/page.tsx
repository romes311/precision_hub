import { getClubs, getMatches } from "@/lib/api";
import { ClubCard } from "@/components/ClubCard";
import { MatchList } from "@/components/MatchList";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const clubs = await getClubs();
  const matches = await getMatches();

  // Filter for upcoming matches only
  const upcomingMatches = matches.filter(
    (match) => new Date(match.startDate) >= new Date()
  );

  return (
    <main className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-card border-border text-card-foreground border-b py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-primary mb-4 text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
            Utah Rifle Shooting Hub
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
            Your central source for verified NRL22 and precision rimfire clubs
            and matches across Utah.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-6xl px-4">
        {/* Matches Section */}
        <div className="mb-12">
          <MatchList
            matches={upcomingMatches}
            title="Upcoming Matches"
            emptyMessage="No upcoming matches scheduled."
          />
        </div>

        <Separator className="bg-border mb-12" />

        {/* Clubs Section */}
        <section className="bg-card border-border mb-12 rounded-xl border p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
              Featured Clubs
            </h2>
            <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
              {clubs.length} Clubs Active
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
