"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GlobalNav() {
  const currentPath = usePathname();

  return (
    <nav className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
        <div className="mr-8 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-primary text-lg font-extrabold tracking-widest uppercase">
              NSP Calendar
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Button
            asChild
            variant={currentPath === "/rimfire" ? "secondary" : "ghost"}
            className={cn(
              "h-8 text-xs font-bold tracking-wider uppercase transition-colors",
              currentPath === "/rimfire" &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/rimfire">Rimfire</Link>
          </Button>
          <Button
            asChild
            variant={currentPath === "/prs" ? "secondary" : "ghost"}
            className={cn(
              "h-8 text-xs font-bold tracking-wider uppercase transition-colors",
              currentPath === "/prs" &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/prs">PRS Series</Link>
          </Button>
          <Button
            asChild
            variant={currentPath === "/nrl-hunter" ? "secondary" : "ghost"}
            className={cn(
              "h-8 text-xs font-bold tracking-wider uppercase transition-colors",
              currentPath === "/nrl-hunter" &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/nrl-hunter">NRL Hunter</Link>
          </Button>
          <Button
            asChild
            variant={currentPath === "/gas-gun" ? "secondary" : "ghost"}
            className={cn(
              "h-8 text-xs font-bold tracking-wider uppercase transition-colors",
              currentPath === "/gas-gun" &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/gas-gun">Gas Gun</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
