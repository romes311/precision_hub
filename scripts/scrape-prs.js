const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs/promises');
const path = require('path');
const moment = require('moment');

const DATA_DIR = path.join(__dirname, '../data');

async function main() {
    console.log("Starting PRS Scraper for Elevated Rimfire...");
    const url = "https://www.precisionrifleseries.com/c/271/elevated-hobble-creek-prs22/";

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const matches = [];

        // Iterate over match links
        $('a[href^="/m/"]').each((i, el) => {
            const link = $(el);
            const href = link.attr('href');
            const name = link.text().trim();

            // The structure seems to be:
            // Container
            //   Date (Text or Element)
            //   Name (Link)
            //   Location (Text or Element)

            // Let's get the container (grandparent based on previous inspection)
            const container = link.parent().parent();
            const text = container.text();

            // We need to parse strict details.
            // Be careful about relying on pure text format.
            // Let's look at children of the container.

            // Based on inspection output:
            // "May 2, 2026\nElevated Rimfire...\nSpringville, Utah"

            // It seems date is the first significant text, name is the link, location is the last.

            // Let's try to extract date.
            // NOTE: The inspection showed matches in Future (2026).
            // We need to handle this robustly.

            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
            // lines[0] -> Date
            // lines[1] -> Name (or part of it)
            // ...
            // lines[last] -> Location

            // A safer way might be accessing previous siblings for date and next siblings for location?
            // But 'grandparent' implies the link is nested deep.
            // Link parent is <h4> or similar?

            // Let's assume the first line of the container text that matches a Date format is the date.
            let dateStr = null;
            let location = "Springville, Utah"; // Fallback

            for (const line of lines) {
                // Try to parse date
                const d = moment(line, ["MMM D, YYYY", "MMMM D, YYYY"], true);
                if (d.isValid()) {
                    dateStr = line;
                    break;
                }
            }

            // If we didn't find a date in lines, it might be separate.
            // But let's trust the inspection output for now.
            // "Jun 6, 2026" was a grandparent text.

            if (!dateStr) {
                // Try standard parsing
                if (lines.length > 0) {
                    // Heuristic: First line is date?
                    if (lines[0].match(/\d{4}/)) {
                        dateStr = lines[0];
                    }
                }
            }

            // Location is usually the last line
            if (lines.length > 2) {
                location = lines[lines.length - 1];
            }

            // ID extraction
            const idMatch = href.match(/\/m\/(\d+)\//);
            const id = idMatch ? parseInt(idMatch[1]) : (Math.random() * 100000) | 0;

            if (name && dateStr) {
                matches.push({
                    id: 10000 + id, // Offset IDs to avoid collision with Impact (though Impact IDs are small, 10000+ should be safe)
                    originalId: id,
                    name: name,
                    startDate: moment(dateStr, "MMM D, YYYY").toISOString(),
                    city: location.split(',')[0].trim(),
                    state: location.split(',')[1]?.trim() || "UT",
                    matchTypeReadableName: "PRS Rimfire",
                    clubId: 264, // Mapping to 'Elevated Rimfire PRS club' in Impact
                    registrationEnabled: true,
                    matchEnded: moment(dateStr, "MMM D, YYYY").isBefore(moment()),
                    source: 'PRS', // Custom field to track source
                    url: `https://www.precisionrifleseries.com${href}`
                });
            }
        });

        console.log(`Found ${matches.length} matches.`);

        if (matches.length > 0) {
            await fs.writeFile(path.join(DATA_DIR, 'prs_matches.json'), JSON.stringify(matches, null, 2));
            console.log("Saved matches to matches.json (prs_matches.json)");
        }

    } catch (error) {
        console.error("Error scraping PRS:", error);
    }
}

main();
