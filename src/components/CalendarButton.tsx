"use client";

import { useState } from "react";
import { Copy, Check, Calendar, Download, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getYahooCalendarUrl,
  downloadIcsFile,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface CalendarButtonProps {
  event: {
    title: string;
    description: string;
    startDate: string;
    location: string;
    url?: string;
  };
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CalendarButton({
  event,
  className,
  variant = "outline",
  size = "default",
}: CalendarButtonProps) {
  const handleGoogleClick = () => {
    window.open(getGoogleCalendarUrl(event), "_blank");
  };

  const handleOutlookClick = () => {
    window.open(getOutlookCalendarUrl(event), "_blank");
  };

  const handleYahooClick = () => {
    window.open(getYahooCalendarUrl(event), "_blank");
  };

  const handleIcsClick = () => {
    downloadIcsFile(event);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
        >
          <Calendar className="h-4 w-4" />
          Sync to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-border text-foreground w-48 bg-[#1E1E1E]"
      >
        <DropdownMenuItem
          onClick={handleGoogleClick}
          className="focus:bg-primary/10 hover:bg-primary/10 cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Google Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleOutlookClick}
          className="focus:bg-primary/10 hover:bg-primary/10 cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Outlook</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleIcsClick}
          className="focus:bg-primary/10 hover:bg-primary/10 cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Apple / Other (ICS)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleYahooClick}
          className="focus:bg-primary/10 hover:bg-primary/10 cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Yahoo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
