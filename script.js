const axios = require('axios');
const cheerio = require('cheerio');

// Base URL and categories
const baseURL = 'https://development.limestonedigital.com/category/';
const categories = [
    'e-commerce-retail',
    'fintech',
    'healthcare',
    'internet-of-things',
    'logistics',
    'martech'
];

// Generate the full URLs
const urls = categories.map(category => `${baseURL}${category}`);

// Function to scrape anchor tags from a given URL
async function scrapeAnchors(url) {
    try {
        // Fetch the HTML of the page
        const { data } = await axios.get(url);

        // Load the HTML into cheerio for parsing
        const $ = cheerio.load(data);

        // Select all <a> tags within the .post-card class
        const anchors = $('.post-card a');

        // Initialize an array to collect log entries
        let logEntries = [];

        // Iterate over all selected <a> tags and format their text
        anchors.each((index, element) => {
            const anchor = $(element);
            const anchorText = anchor.text().trim();
            const anchorHref = anchor.attr('href');

            // Ensure only non-empty entries are added
            if (anchorText && anchorHref) {
                logEntries.push(anchorText);  // Only push the anchor text
            }
        });

        return logEntries;

    } catch (error) {
        console.error(`Error scraping the site ${url}:`, error);
        return [];
    }
}

// Function to scrape all URLs and list down all anchors
async function scrapeAllUrls() {
    let allEntries = [];

    for (const url of urls) {
        const entries = await scrapeAnchors(url);
        allEntries = allEntries.concat(entries);
    }

    // Remove duplicates
    const uniqueEntries = Array.from(new Set(allEntries));

    // Print unique entries
    console.log(uniqueEntries.join('\n'));
}

// Call the function
scrapeAllUrls();
