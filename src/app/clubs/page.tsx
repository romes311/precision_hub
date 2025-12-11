import Link from "next/link";
import { getClubs } from "@/lib/api";
import { ClubCard } from "@/components/ClubCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function ClubsPage() {
    const clubs = await getClubs();

    return (
        <main className="bg-background min-h-screen pb-20">
            <div className="bg-card border-border text-card-foreground border-b py-16">
                <div className="container mx-auto max-w-6xl px-4">
                    <h1 className="text-primary mb-4 text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
                        Featured Clubs
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
                        Explore verified NRL22 and precision rimfire clubs across Utah.
                    </p>
                </div>
            </div>

            <div className="container mx-auto -mt-8 max-w-6xl px-4">
                <section className="bg-card border-border mb-12 rounded-xl border p-6 shadow-sm md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-foreground text-2xl font-bold tracking-wide uppercase">
                            Active Clubs
                        </h2>
                        <span className="text-primary-foreground bg-primary rounded-sm px-3 py-1 text-sm font-medium">
                            {clubs.length} Clubs
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
