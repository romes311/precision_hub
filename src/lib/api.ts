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
  const impactClubs = (data?.payload.clubs || []).map((c) => {
    if (c.name.includes("SPARC") || c.name.includes("Gas Gun")) {
      return { ...c, source: "GAS_GUN" as const };
    }
    return { ...c, source: "IMPACT" as const };
  });

  // Defining PRS Club manually but trying to reuse Impact image if available
  const elevatedImpact = impactClubs.find((c) =>
    c.name.includes("Elevated Rimfire")
  );

  const prsClub: Club = {
    id: 99901,
    name: "Elevated Rimfire",
    city: "Springville",
    state: "UT",
    source: "PRS",
    description: "Precision Rifle Series matches in Utah.",
    website:
      "https://www.precisionrifleseries.com/c/271/elevated-hobble-creek-prs22/",
    logoImage: elevatedImpact?.logoImage,
  };

  // Define NRL Hunter Clubs
  const highDesertHunter: Club = {
    id: 99902,
    name: "High Desert Hunter",
    city: "Vernal",
    state: "UT",
    source: "NRL_HUNTER",
    description: "Host of the High Desert Hunter match.",
    website:
      "https://www.nrlhunter.org/matches/72ed1847-9b50-4e9c-9bfe-c96c42e2a8fd",
    logoImage: {
      fileId: "local-hdh",
      previewUrl: "/high-desert.png",
      identityId: 0,
      thumbnailUrl: null,
      bigUrl: null,
      originalUrl: null,
    },
  };

  const hornadyHunter: Club = {
    id: 99903,
    name: "Hornady Precision Hunter Challenge",
    city: "Price",
    state: "UT",
    source: "NRL_HUNTER",
    description: "Host of the Hornady Precision Hunter Challenge.",
    website:
      "https://www.nrlhunter.org/matches/2e0ca80c-d449-45a5-a4e0-425be02dfe68",
    logoImage: {
      fileId: "local-hph",
      previewUrl: "/hornady-precision.png",
      identityId: 0,
      thumbnailUrl: null,
      bigUrl: null,
      originalUrl: null,
    },
  };

  return [...impactClubs, prsClub, highDesertHunter, hornadyHunter];
}

export async function getMatches(): Promise<Match[]> {
  const impactData = await readJson<{ payload: { matchesListView: Match[] } }>(
    "matches.json"
  );
  const impactMatches = (impactData?.payload.matchesListView || []).map((m) => {
    // Check for Gas Gun matches (SPARC)
    if (m.name.toUpperCase().includes("SPARC")) {
      return { ...m, source: "GAS_GUN" as const };
    }
    return { ...m, source: "IMPACT" as const };
  });

  const prsMatches = await readJson<Match[]>("prs_matches.json");
  const allPrsMatches = prsMatches || [];

  const hunterMatches = await readJson<Match[]>("nrl_hunter_matches.json");
  const allHunterMatches = (hunterMatches || []).map((m) => {
    let logoImage = undefined;
    if (m.name.includes("High Desert")) {
      logoImage = {
        fileId: "local-hdh",
        previewUrl: "/high-desert.png",
        identityId: 0,
        thumbnailUrl: null,
        bigUrl: null,
        originalUrl: null,
      };
    } else if (m.name.includes("Hornady")) {
      logoImage = {
        fileId: "local-hph",
        previewUrl: "/hornady-precision.png",
        identityId: 0,
        thumbnailUrl: null,
        bigUrl: null,
        originalUrl: null,
      };
    }
    return { ...m, logoImage };
  });

  // Combine and sort
  const allMatches = [...impactMatches, ...allPrsMatches, ...allHunterMatches];

  // Deduplicate based on name + date (basic check) if needed, but IDs are offset so they won't clash technically.
  // Ideally, if a match is on both, we prefer one.
  // For now, let's just return all and see.

  return allMatches.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
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
      m.creatorSocialIdentityId === club.creatorSocialIdentityId
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
