"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GlobalNav() {
    const searchParams = useSearchParams();
    const currentSource = searchParams.get("source");

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
                <div className="mr-8 flex items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="text-primary font-extrabold uppercase tracking-widest text-lg">
                            NSP Calendar
                        </span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium">
                    <Button
                        asChild
                        variant={currentSource === "IMPACT" || !currentSource ? "secondary" : "ghost"}
                        className={cn(
                            "h-8 transition-colors uppercase tracking-wider text-xs font-bold",
                            (currentSource === "IMPACT" || !currentSource) && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <Link href="/?source=IMPACT">NRL22 / Impact</Link>
                    </Button>
                    <Button
                        asChild
                        variant={currentSource === "PRS" ? "secondary" : "ghost"}
                        className={cn(
                            "h-8 transition-colors uppercase tracking-wider text-xs font-bold",
                            currentSource === "PRS" && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <Link href="/?source=PRS">PRS Series</Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="h-8 transition-colors uppercase tracking-wider text-xs font-bold"
                    >
                        <Link href="/clubs">Clubs</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
