import { getClubs, getMatches } from "@/lib/api";
import { MatchList } from "@/components/MatchList";
import { ClubCard } from "@/components/ClubCard";

export const dynamic = "force-dynamic";

export default async function RimfirePage() {
  const allMatches = await getMatches();

  // Filter for Impact matches only
  const matches = allMatches.filter((m) => m.source === "IMPACT");

  const upcomingMatches = matches
    .filter((match) => new Date(match.startDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  // Get Clubs
  const allClubs = await getClubs();
  const clubs = allClubs.filter((c) => c.source === "IMPACT");

  return (
    <main className="bg-background min-h-screen pb-20">
      <div className="bg-card border-border text-card-foreground border-b py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-primary mb-4 text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
            Rimfire Matches & Clubs
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
            Verified NRL22 and precision rimfire events across Utah.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-6xl px-4">
        {/* Matches */}
        <div className="mb-12">
          <MatchList
            matches={upcomingMatches}
            title="Upcoming Rimfire Matches"
            emptyMessage="No upcoming rimfire matches scheduled."
          />
        </div>

        {/* Clubs */}
        <section className="bg-card border-border mb-12 rounded-xl border p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
              Rimfire Clubs
            </h2>
            <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
              {clubs.length} Active
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
