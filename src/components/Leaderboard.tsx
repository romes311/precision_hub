import { MatchResult, Shooter } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardProps {
  results: MatchResult;
}

export function Leaderboard({ results }: LeaderboardProps) {
  const { shooters, divisions, classifications } = results;

  // Helpers
  const getDivisionName = (id: number) =>
    divisions.find((d) => d.id === id)?.name || "-";
  const getClassName = (id: number) =>
    classifications.find((c) => c.id === id)?.name || "-";
  const getClassColor = (id: number) =>
    classifications.find((c) => c.id === id)?.hexColor || "888888";

  // Sort by rank
  const sortedShooters = [...shooters].sort((a, b) => a.rank - b.rank);

  return (
    <div className="border-border bg-card overflow-x-auto rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="text-primary w-[80px] text-center font-bold">
              Rank
            </TableHead>
            <TableHead className="text-muted-foreground">Shooter</TableHead>
            <TableHead className="text-muted-foreground">Division</TableHead>
            <TableHead className="text-muted-foreground">Class</TableHead>
            <TableHead className="text-muted-foreground text-right">
              Total Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedShooters.map((shooter) => {
            let rankClass = "";
            if (shooter.rank === 1)
              rankClass = "bg-yellow-500/10 hover:bg-yellow-500/20";
            else if (shooter.rank === 2)
              rankClass = "bg-muted/30 hover:bg-muted/50";
            else if (shooter.rank === 3)
              rankClass = "bg-orange-500/10 hover:bg-orange-500/20";

            return (
              <TableRow key={shooter.id} className={rankClass}>
                <TableCell className="text-primary text-center text-lg font-bold">
                  #{shooter.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="border-border h-9 w-9 border">
                      <AvatarImage
                        src={shooter.profileImage?.thumbnailUrl || ""}
                        alt={shooter.firstName}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {shooter.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {shooter.firstName} {shooter.lastName}
                      </span>
                      {shooter.handleName && (
                        <span className="text-muted-foreground text-xs">
                          {shooter.handleName}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/5 font-normal"
                  >
                    {getDivisionName(shooter.divisionId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {/* Custom colored badge for Class */}
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm"
                    style={{
                      backgroundColor: `#${getClassColor(shooter.classificationId)}20`,
                      borderColor: `#${getClassColor(shooter.classificationId)}60`,
                      color: `#${getClassColor(shooter.classificationId)}`,
                    }}
                  >
                    {getClassName(shooter.classificationId)}
                  </span>
                </TableCell>
                <TableCell className="text-foreground text-right text-lg font-bold">
                  {shooter.points.toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
