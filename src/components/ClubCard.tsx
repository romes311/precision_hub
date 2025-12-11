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
    <Card className="bg-card border-border overflow-hidden border shadow-sm transition-shadow hover:shadow-lg">
      <div className="bg-muted relative h-48 w-full">
        <img
          src={logoUrl}
          alt={club.name}
          className="h-full w-full object-cover"
          loading="lazy"
          // Very basic fallback via JS in img tag isn't ideal in React, handled by onError usually.
          // For now, relying on the previewUrl being mostly good or the placeholder above.
        />
      </div>
      <CardHeader className="pb-2">
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
      <CardContent className="pb-4">
        {/* Short description logic could go here, but API doesn't always provide a good short one */}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full font-bold">
          <Link href={`/club/${club.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
