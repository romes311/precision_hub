const fs = require("fs/promises");
const path = require("path");

const API_ENDPOINT = "https://app-api.impactscoring.net";
const DATA_DIR = path.join(__dirname, "../data");
const RESULTS_DIR = path.join(DATA_DIR, "results");

// Headers required by the API to avoid 403s
const HEADERS = {
  Origin: "https://www.impactscoring.net",
  Referer: "https://www.impactscoring.net/clubs",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
};

async function fetchJson(url) {
  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      console.error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
      // Try reading body for error detail
      try {
        const text = await response.text();
        console.error("Error Response Body:", text);
      } catch (e) {}
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function saveJson(filename, data) {
  await fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2)
  );
  console.log(`Saved ${filename}`);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("Starting data synchronization...");

  // 1. Fetch Clubs (Utah)
  console.log("Fetching Clubs...");
  // Must provide searchTerm and offset apparently, based on successful POC
  const clubsUrl = `${API_ENDPOINT}/rest/website/searchClubs?searchTerm=&countryId=2&stateId=159&pageSize=100&offset=0`;
  const clubsData = await fetchJson(clubsUrl);

  if (clubsData) {
    await saveJson("clubs.json", clubsData);
  } else {
    console.error("Critical: Failed to fetch clubs.");
    // Proceeding anyway might be risky if we rely on club data, but let's try to get matches at least.
  }

  // 2. Fetch Matches (Utah)
  // 2. Fetch Matches (Utah)
  // 2. Fetch Matches (Utah) - Fetch both Upcoming (0) and Finished (1)
  console.log("Fetching Matches...");
  const baseMatchUrl = `${API_ENDPOINT}/rest/website/getMatchesForListViewAndCalendar?countryId=2&stateId=159&pageSize=100&offset=0&searchTerm=&getMatchesForListView=true&getMatchesForCalendar=false`;

  // Use specific referer for matches just in case
  const matchHeaders = {
    ...HEADERS,
    Referer: "https://www.impactscoring.net/matches",
  };

  let allMatches = [];

  // Fetch Upcoming Matches (Status 0)
  try {
    console.log("Fetching Upcoming Matches...");
    const res = await fetch(`${baseMatchUrl}&matchStatus=0`, {
      headers: matchHeaders,
    });
    if (res.ok) {
      const data = await res.json();
      const matches = data.payload?.matchesListView || [];
      console.log(`Found ${matches.length} upcoming matches.`);
      allMatches = [...allMatches, ...matches];
    } else {
      console.error("Failed to fetch upcoming matches");
    }
  } catch (e) {
    console.error("Exception fetching upcoming matches:", e);
  }

  // Fetch Finished Matches (Status 1)
  try {
    console.log("Fetching Finished Matches...");
    const res = await fetch(`${baseMatchUrl}&matchStatus=1`, {
      headers: matchHeaders,
    });
    if (res.ok) {
      const data = await res.json();
      const matches = data.payload?.matchesListView || [];
      console.log(`Found ${matches.length} finished matches.`);
      allMatches = [...allMatches, ...matches];
    } else {
      console.error("Failed to fetch finished matches");
    }
  } catch (e) {
    console.error("Exception fetching finished matches:", e);
  }

  if (allMatches.length > 0) {
    // Dedup matches just in case
    const seen = new Set();
    const uniqueMatches = allMatches.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Save combined matches
    // Construct a payload object that mimics the API structure so the app can consume it if it expects that
    // But simpler: just save the list, or the list inside a payload.
    // The original script expected `matchesData` to be the full response object.
    // Let's create a synthetic response object.
    const syntheticResponse = {
      errorCode: 0,
      payload: {
        matchesListView: uniqueMatches,
        totalCountListView: uniqueMatches.length,
      },
    };

    await saveJson("matches.json", syntheticResponse);

    console.log(`Total unique matches to process: ${uniqueMatches.length}`);

    const matches = uniqueMatches;

    // 3. Fetch Results for EACH match
    if (matches.length > 0) {
      console.log("Fetching Match Results...");

      let successCount = 0;
      let failCount = 0;

      // Ensure results directory exists
      try {
        await fs.mkdir(RESULTS_DIR, { recursive: true });
      } catch (err) {
        console.error("Error creating results directory:", err);
      }

      for (const match of matches) {
        const resultFile = path.join(RESULTS_DIR, `${match.id}.json`);

        // We want ALL results. Even past ones.
        const resultsUrl = `${API_ENDPOINT}/rest/website/getLiveScores?matchId=${match.id}&pageSize=1000`;
        console.log(
          `Fetching results for match ${match.id} (${match.name})...`
        );

        const resultsData = await fetchJson(resultsUrl);

        if (resultsData && resultsData.errorCode === 0) {
          await fs.writeFile(resultFile, JSON.stringify(resultsData, null, 2));
          successCount++;
        } else {
          console.warn(`Failed to fetch/valid results for match ${match.id}`);
          failCount++;
        }

        // Polite delay
        await delay(500);
      }

      console.log("Synchronization Complete.");
      console.log(`Matches Processed: ${matches.length}`);
      console.log(`Results Saved: ${successCount}`);
      console.log(`Errors: ${failCount}`);
    } else {
      console.log("No matches found to fetch results for.");
    }
  } else {
    console.error("Critical: Failed to fetch matches.");
  }
}

main().catch(console.error);
