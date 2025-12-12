import Link from "next/link";
import { Club } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const logoUrl =
    club.logoImage?.previewUrl ||
    `https://placehold.co/400x200?text=${club.name.charAt(0)}`;

  return (
    <Card className="bg-card border-border gap-0 overflow-hidden border p-0 shadow-sm transition-shadow hover:shadow-lg">
      <div className="bg-muted relative h-48 w-full">
        {club.source === "NRL_HUNTER" && club.website ? (
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            <img
              src={logoUrl}
              alt={club.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </a>
        ) : (
          <img
            src={logoUrl}
            alt={club.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <CardHeader className="px-6 pt-6 pb-2">
        <h3
          className="text-card-foreground line-clamp-1 text-xl font-bold tracking-wide uppercase"
          title={club.name}
        >
          {club.name}
        </h3>
        <div className="text-muted-foreground flex items-center text-sm">
          <MapPin className="mr-1 h-3 w-3" />
          {club.city}, {club.state}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {/* Short description logic could go here, but API doesn't always provide a good short one */}
      </CardContent>
      <CardFooter className="p-6">
        <Button asChild className="w-full font-bold">
          {club.source === "NRL_HUNTER" && club.website ? (
            <a href={club.website} target="_blank" rel="noopener noreferrer">
              View Match Info
            </a>
          ) : (
            <Link href={`/club/${club.id}`}>View Details</Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
