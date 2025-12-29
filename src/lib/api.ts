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
  const baseClubs = data?.payload.clubs || [];

  const clubMappings = baseClubs.map((c) => {
    // Gas Gun
    if (c.id === 254 || c.name.includes("SPARC")) {
      return { ...c, source: "GAS_GUN" as const };
    }
    // Rimfire
    if (
      c.id === 65 || // Hobble Creek
      c.id === 256 || // Salt Lake NRL22
      c.id === 275 || // Heathen Precision
      c.id === 264 || // Elevated Rimfire
      c.name.includes("NRL22") ||
      c.name.includes("Rimfire")
    ) {
      return { ...c, source: "RIMFIRE" as const };
    }
    // PRS (Centerfire)
    if (
      c.id === 310 || // 3 Mile
      c.id === 145 || // Buckskin
      c.id === 88 || // Sweat Springs
      c.name.includes("PRS") ||
      c.name.includes("Precision Rifle")
    ) {
      return { ...c, source: "PRS" as const };
    }
    return { ...c, source: "RIMFIRE" as const }; // Default to Rimfire for Impact clubs if unsure
  });

  // NRL Hunter Clubs (Manual)
  const nrlHunterClubs: Club[] = [
    {
      id: 99902,
      name: "Blue Mountain NRL Hunter (Eric)",
      city: "Vernal",
      state: "UT",
      source: "NRL_HUNTER",
      description: "NRL Hunter match in Blue Mountain.",
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
    },
    {
      id: 99903,
      name: "NRL Hunter (Verl Dallin)",
      city: "Price",
      state: "UT",
      source: "NRL_HUNTER",
      description: "NRL Hunter match series.",
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
    },
  ];

  // Additional PRS (Centerfire) Clubs (Manual)
  const manualPrsClubs: Club[] = [
    {
      id: 99904,
      name: "Tremonton PRS (Tony Peterson)",
      city: "Tremonton",
      state: "UT",
      source: "PRS",
      description: "Northern Utah Precision Rifle Match.",
      website:
        "https://www.precisionrifleseries.com/c/46/northern-utah-precision-rifle-match/",
    },
    {
      id: 99905,
      name: "Central Utah Precision Rifle (John Van Orman)",
      city: "Manti",
      state: "UT",
      source: "PRS",
      description: "Central Utah Precision Rifle series.",
      website:
        "https://www.precisionrifleseries.com/c/44/central-utah-precision-rifle/",
    },
    {
      id: 99906,
      name: "Ball Busters (Paul Dallin)",
      city: "Lake Shore",
      state: "UT",
      source: "PRS",
      description: "Lake Shore Gentleman's Club - Ball Busters.",
      website: "https://practiscore.com/clubs/lake_shore_gentleman_club",
    },
  ];

  return [...clubMappings, ...nrlHunterClubs, ...manualPrsClubs];
}

export async function getMatches(): Promise<Match[]> {
  const impactData = await readJson<{ payload: { matchesListView: Match[] } }>(
    "matches.json"
  );
  const impactMatches = (impactData?.payload.matchesListView || []).map((m) => {
    const name = m.name.toUpperCase();
    const type = m.matchTypeReadableName?.toUpperCase();

    // Gas Gun
    if (name.includes("SPARC") || m.creatorSocialIdentityId === 2958) {
      return { ...m, source: "GAS_GUN" as const };
    }

    // Rimfire
    if (
      type?.includes("RIMFIRE") ||
      name.includes("RIMFIRE") ||
      name.includes("NRL22") ||
      name.includes("22 LR") ||
      m.creatorSocialIdentityId === 807 || // Hobble Creek
      m.creatorSocialIdentityId === 5827 || // Salt Lake NRL22
      m.creatorSocialIdentityId === 961 || // Heathen Precision
      m.creatorSocialIdentityId === 5754 // Elevated Rimfire
    ) {
      return { ...m, source: "RIMFIRE" as const };
    }

    // PRS Centerfire (Impact based)
    if (
      m.creatorSocialIdentityId === 1482 || // 3 Mile
      m.creatorSocialIdentityId === 653 || // Buckskin
      m.creatorSocialIdentityId === 983 || // Sweat Springs
      type?.includes("CENTERFIRE") ||
      name.includes("PRS")
    ) {
      return { ...m, source: "PRS" as const };
    }
    // Default Impact matches to Rimfire
    return { ...m, source: "RIMFIRE" as const };
  });

  const prsMatches = await readJson<Match[]>("prs_matches.json");
  const allPrsMatches = (prsMatches || []).map((m) => ({
    ...m,
    // The current prs_matches.json seems to be mostly Elevated Rimfire (PRS22)
    source:
      m.matchTypeReadableName?.includes("Rimfire") || m.name.includes("Rimfire")
        ? ("RIMFIRE" as const)
        : ("PRS" as const),
  }));

  const hunterMatches = await readJson<Match[]>("nrl_hunter_matches.json");
  const allHunterMatches = (hunterMatches || []).map((m) => {
    let logoImage = undefined;
    if (m.name.includes("High Desert") || m.name.includes("Blue Mountain")) {
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
    return { ...m, source: "NRL_HUNTER" as const, logoImage };
  });

  // Combine and sort
  const allMatches = [...impactMatches, ...allPrsMatches, ...allHunterMatches];

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
