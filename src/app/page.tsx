import { getMatches } from "@/lib/api";
import { MatchList } from "@/components/MatchList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allMatches = await getMatches();

  // Filter for upcoming only
  const upcomingMatches = allMatches
    .filter((match) => new Date(match.startDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  // Split by source
  const rimfireMatches = upcomingMatches
    .filter((m) => m.source === "RIMFIRE")
    .slice(0, 4);
  const prsMatches = upcomingMatches
    .filter((m) => m.source === "PRS")
    .slice(0, 4);
  const hunterMatches = upcomingMatches
    .filter((m) => m.source === "NRL_HUNTER")
    .slice(0, 4);
  const gasGunMatches = upcomingMatches
    .filter((m) => m.source === "GAS_GUN")
    .slice(0, 4);

  return (
    <main className="bg-background min-h-screen pb-20">
      <div className="border-border relative overflow-hidden border-b pt-32 pb-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white uppercase drop-shadow-md md:text-6xl">
            Utah Rifle Shooting Hub
          </h1>
          <p className="max-w-2xl text-xl font-medium text-gray-200 drop-shadow-sm md:text-2xl">
            The central calendar for verified precision rifle matches across
            Utah.
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-12 max-w-6xl space-y-12 px-4">
        {/* Rimfire Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide uppercase">
              Rimfire Matches
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/rimfire">
                View All & Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MatchList
            matches={rimfireMatches}
            emptyMessage="No upcoming rimfire matches."
            layout="list"
          />
        </section>

        {/* PRS Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide uppercase">
              Centerfire PRS
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/prs">
                View All & Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MatchList
            matches={prsMatches}
            emptyMessage="No upcoming PRS matches."
            layout="list"
          />
        </section>

        {/* NRL Hunter Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide uppercase">
              NRL Hunter
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/nrl-hunter">
                View All & Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MatchList
            matches={hunterMatches}
            emptyMessage="No upcoming NRL Hunter matches."
            layout="list"
          />
        </section>

        {/* Gas Gun Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide uppercase">
              Gas Gun
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/gas-gun">
                View All & Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MatchList
            matches={gasGunMatches}
            emptyMessage="No upcoming Gas Gun matches."
            layout="list"
          />
        </section>
      </div>
    </main>
  );
}
