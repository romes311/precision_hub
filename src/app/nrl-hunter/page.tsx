import { getClubs, getMatches } from "@/lib/api";
import { MatchList } from "@/components/MatchList";
import { ClubCard } from "@/components/ClubCard";

export const dynamic = "force-dynamic";

// Force re-render to pick up new data

export default async function NrlHunterPage() {
  const allMatches = await getMatches();

  // Filter for NRL Hunter matches
  const matches = allMatches.filter((m) => m.source === "NRL_HUNTER");

  // Get Clubs
  const allClubs = await getClubs();
  const clubs = allClubs.filter((c) => c.source === "NRL_HUNTER");

  const upcomingMatches = matches
    .filter((match) => new Date(match.startDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return (
    <main className="bg-background min-h-screen pb-20">
      <div className="bg-card border-border text-card-foreground border-b py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-primary mb-4 text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
            NRL Hunter Matches
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
            Official NRL Hunter Series events.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-8 max-w-6xl px-4">
        {/* Events Grid */}
        <section className="bg-card border-border mb-12 rounded-xl border p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
              Featured Events
            </h2>
            <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
              {clubs.length} Events
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
