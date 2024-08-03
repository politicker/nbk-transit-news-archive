import { launch } from "jsr:@astral/astral"
import "jsr:@std/dotenv/load"
import { stringify } from "jsr:@std/csv"
import { urls } from "./domains.ts"
import { extractors } from "./extractors/index.ts"

// Iterate through list of URLS from the sheet
const extractedData = []
for (const url of urls) {
  const u = new URL(url)
  const domain = u.hostname
  console.log(`Extracting data from ${domain}`)
  let headline = ""
  let publicationDate = ""
  let authors = ""
  for (const extractor of extractors) {
    if (headline && publicationDate && authors) {
      break
    }

    const [foundHeadline, foundPublicationDate, foundAuthors] = await extractor(
      url,
    )

    if (!headline && foundHeadline) {
      headline = foundHeadline
    }
    if (!publicationDate && foundPublicationDate) {
      publicationDate = foundPublicationDate
    }
    if (!authors && foundAuthors) {
      authors = foundAuthors
    }
  }

  if (!headline || !publicationDate || !authors) {
    console.error(`Failed to extract data from ${domain}`)
    continue
  }

  extractedData.push({
    url,
    headline,
    publicationDate,
    authors,
  })
}

// Write data to CSV
stringify(extractedData)
