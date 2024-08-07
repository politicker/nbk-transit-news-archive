import { launch } from "jsr:@astral/astral"
import "jsr:@std/dotenv/load"
import { stringify } from "jsr:@std/csv"
import { urls } from "./domains.ts"
import { extractors } from "./extractors/index.ts"
import { parse } from "https://deno.land/std@0.84.0/flags/mod.ts"

import { readJson } from "https://deno.land/std@0.66.0/fs/read_json.ts"
import { GoogleSpreadsheet } from "npm:google-spreadsheet"
import { JWT } from "npm:google-auth-library"
import { formatDate } from "./utils.ts"

const credentials = await readJson("credentials.json") as {
  client_email: string
  private_key: string
}

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const doc = new GoogleSpreadsheet(
  "1aFnO_zJ-9UbbLgQKlRGykKq8syBWqZtOHXmdF9zgUrQ", // harrison test sheet
  serviceAccountAuth,
)

const flags = parse(Deno.args)
// const alreadySeenDomains = new Set<string>()

await doc.loadInfo()
const sheet = doc.sheetsByTitle["Other "]

interface Row {
  Media: string // publication (e.g. NY Times)
  Date: string // date published
  Byline: string // author
  Headline: string
  URL: string
}
const rows = await sheet.getRows<Row>()

for (const row of rows) {
  if (row.get("Byline")) {
    continue
  }

  const url = row.get("URL")
  const u = new URL(url)
  const domain = u.hostname

  if (flags.u && !domain.includes(flags.u)) {
    continue
  }

  // if (alreadySeenDomains.has(domain)) {
  //   continue
  // } else {
  //   alreadySeenDomains.add(domain)
  // }

  console.log(`${row.rowNumber} - extracting data from ${domain}`)
  let headline = ""
  let publicationDate = ""
  let authors = ""

  for (const extractor of extractors) {
    if (headline && publicationDate && authors) {
      break
    }

    let foundHeadline = ""
    let foundPublicationDate = ""
    let foundAuthors = ""
    try {
      ;[foundHeadline, foundPublicationDate, foundAuthors] = await extractor(
        url,
      )
    } catch (e) {
      console.error(
        `${row.rowNumber} - error extracting data from ${domain}`,
        e,
      )
    }

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

  row.assign({
    Headline: headline,
    Date: formatDate(publicationDate),
    Byline: authors,

    // These should be left alone, but assign requires us to set them
    URL: url,
    Media: row.get("Media"),
  })

  try {
    console.log(`${row.rowNumber} - saving row`)
    await row.save()
  } catch (e) {
    console.error(`${row.rowNumber} - error updating row`, e)
  }

  console.log("----------------------------------------")
}
