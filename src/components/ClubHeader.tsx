import { Club } from "@/types";
import { MapPin, Globe, Mail } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link"; // If specific logic needed, though this is visual mostly

interface ClubHeaderProps {
  club: Club;
}

export function ClubHeader({ club }: ClubHeaderProps) {
  const logoUrl =
    club.logoImage?.previewUrl ||
    `https://placehold.co/150x150?text=${club.name.charAt(0)}`;
  const location = [club.city, club.state].filter(Boolean).join(", ");

  return (
    <div className="bg-card border-border mb-8 flex flex-col items-start gap-8 rounded-lg border p-6 shadow-sm md:flex-row md:p-8">
      <div className="mx-auto shrink-0 md:mx-0">
        <img
          src={logoUrl}
          alt={club.name}
          className="border-muted h-32 w-32 rounded-full border-4 object-cover shadow-sm md:h-40 md:w-40"
          // onError logic handled by parent or fallback
        />
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold tracking-wide uppercase">
            {club.name}
          </h1>
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <div className="flex items-center">
              <MapPin className="text-primary mr-1 h-4 w-4" />
              {location}
            </div>
            {club.contactEmail && (
              <div className="flex items-center">
                <Mail className="text-primary mr-1 h-4 w-4" />
                {club.contactEmail}
              </div>
            )}
          </div>
        </div>

        <div className="text-card-foreground max-w-3xl leading-relaxed">
          {club.about || club.description || "No description available."}
        </div>

        {club.website && (
          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <a
                href={
                  club.website.startsWith("http")
                    ? club.website
                    : `https://${club.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
