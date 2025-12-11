import path from "path";
import fs from "fs/promises";
import { Club, Match, MatchResult } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

export async function getClubs(): Promise<Club[]> {
  const data = await readJson<{ payload: { clubs: Club[] } }>("clubs.json");
  return data?.payload.clubs || [];
}

export async function getMatches(): Promise<Match[]> {
  const impactData = await readJson<{ payload: { matchesListView: Match[] } }>(
    "matches.json"
  );
  const impactMatches = (impactData?.payload.matchesListView || []).map(m => ({
    ...m,
    source: "IMPACT" as const
  }));

  const prsMatches = await readJson<Match[]>("prs_matches.json");
  const allPrsMatches = prsMatches || [];

  // Combine and sort
  const allMatches = [...impactMatches, ...allPrsMatches];

  // Deduplicate based on name + date (basic check) if needed, but IDs are offset so they won't clash technically.
  // Ideally, if a match is on both, we prefer one. 
  // For now, let's just return all and see.

  return allMatches.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export async function getClubDetails(
  id: number
): Promise<{ club: Club; matches: Match[] } | null> {
  const clubs = await getClubs();
  const club = clubs.find((c) => c.id === id);

  if (!club) return null;

  const allMatches = await getMatches();

  // Link matches to club via creatorSocialIdentityId
  // Some matches might not have clubId, so we use the social identity as a proxy
  const clubMatches = allMatches.filter(
    (m) =>
      // Direct match on clubId if available (though often null)
      m.clubId === club.id ||
      // Fallback to social identity (most reliable based on data inspection)
      m.creatorSocialIdentityId ===
      club.creatorSocialIdentityId
  );

  // Sort matches: Upcoming first? Or just by date.
  // The matches.json seems to have mixed order. Let's sort by date descending.
  clubMatches.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return { club, matches: clubMatches };
}

export async function getMatchResults(id: number): Promise<MatchResult | null> {
  const data = await readJson<{ payload: MatchResult }>(`results/${id}.json`);
  return data?.payload || null;
}
