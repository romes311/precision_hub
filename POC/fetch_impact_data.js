/**
 * Impact Scoring Data Fetcher
 *
 * This script demonstrates how to fetch the Utah Rifle Clubs data directly from the impactscoring.net API.
 *
 * Usage:
 * node fetch_impact_data.js
 */

const https = require("https");

// Configuration
const API_ENDPOINT =
  "https://app-api.impactscoring.net/rest/website/searchClubs";
const COUNTRY_ID_US = 2; // United States
const STATE_ID_UTAH = 159; // Utah
const MAX_CLUBS = 50;

async function fetchClubs() {
  const params = new URLSearchParams({
    searchTerm: "",
    countryId: COUNTRY_ID_US,
    stateId: STATE_ID_UTAH,
    pageSize: MAX_CLUBS,
    offset: 0,
  });

  const url = `${API_ENDPOINT}?${params.toString()}`;

  console.log(`Fetching data from: ${url}`);

  // Note: The API requires Origin and Referer headers to be set to the original domain
  // to avoid CORS/security rejections in some environments (though raw Node.js often bypasses CORS,
  // the server might check these headers explicitly).
  const options = {
    headers: {
      Origin: "https://www.impactscoring.net",
      Referer: "https://www.impactscoring.net/clubs",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    },
  };

  return new Promise((resolve, reject) => {
    https
      .get(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Main execution
(async () => {
  try {
    const response = await fetchClubs();

    if (
      response.errorLabel === "SUCCESS" &&
      response.payload &&
      response.payload.clubs
    ) {
      const clubs = response.payload.clubs;
      console.log(`\nFound ${clubs.length} clubs in Utah:\n`);

      clubs.forEach((club) => {
        console.log(`- ${club.name}`);
        console.log(`  Location: ${club.city}, ${club.state}`);
        console.log(`  ID: ${club.id}`);
        console.log(
          `  Details: https://www.impactscoring.net/club/view?id=${club.id}`
        );
        console.log("---");
      });

      // Note: You can now store this 'clubs' array in your own database/webapp
    } else {
      console.error("Failed to fetch clubs or invalid response format.");
      console.error(response);
    }
  } catch (error) {
    console.error("Error executing fetch:", error);
  }
})();
