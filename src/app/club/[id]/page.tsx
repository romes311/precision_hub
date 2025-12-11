import { notFound } from "next/navigation";
import { getClubDetails } from "@/lib/api";
import { ClubHeader } from "@/components/ClubHeader";
import { MatchList } from "@/components/MatchList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClubPage(props: PageProps) {
  const params = await props.params;
  const clubId = parseInt(params.id, 10);

  if (isNaN(clubId)) {
    notFound();
  }

  const data = await getClubDetails(clubId);

  if (!data) {
    notFound();
  }

  const { club, matches } = data;

  return (
    <main className="bg-background min-h-screen pb-20">
      <div className="bg-card border-border border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:bg-primary -ml-4 hover:text-black"
          >
            <Link href="/">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Hub
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <ClubHeader club={club} />

        <div className="space-y-8">
          <MatchList
            matches={matches}
            title="Club Matches"
            emptyMessage="No matches found for this club."
          />
        </div>
      </div>
    </main>
  );
}
