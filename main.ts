import { launch } from "jsr:@astral/astral"
import "jsr:@std/dotenv/load"
import { extractors } from "./extractors/index.ts"
import { parse } from "https://deno.land/std@0.84.0/flags/mod.ts"

import { readJson } from "https://deno.land/std@0.66.0/fs/read_json.ts"
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "npm:google-spreadsheet"
import { JWT } from "npm:google-auth-library"
import { formatDate } from "./utils.ts"
import { AxiosError } from "npm:axios"
import * as HTMLEntities from "https://deno.land/std@0.224.0/html/entities.ts"

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
  "1QvWha8j4O9E1WI-ROAojqdWAUfY4ZvaVh0V0AIleuwY", // real sheet :O
  serviceAccountAuth,
)

const flags = parse(Deno.args)
// const alreadySeenDomains = new Set<string>()

await doc.loadInfo()
const sheet = doc.sheetsByTitle["Other"]

interface Row {
  to: string
  // Media: string // publication (e.g. NY Times)
  Date: string // date published
  Byline: string // author
  Headline: string // article headline
  URL: string // url of the article
}
const rows = await sheet.getRows<Row>()

for (const row of rows) {
  if (row.get("Headline")) {
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

  let foundHeadline = ""
  let foundPublicationDate = ""
  let foundAuthors = ""
  let foundSiteTitle = ""

  for (const extractor of extractors) {
    if (
      foundHeadline && foundPublicationDate && foundAuthors && foundSiteTitle
    ) {
      break
    }

    try {
      const {
        headline,
        publicationDate,
        author,
        siteTitle,
      } = await extractor(url)

      if (!foundHeadline && headline) {
        foundHeadline = headline
      }
      if (!foundPublicationDate && publicationDate) {
        foundPublicationDate = publicationDate
      }
      if (!foundAuthors && author) {
        foundAuthors = author
      }
      if (!foundSiteTitle && siteTitle) {
        foundSiteTitle = siteTitle
      }
    } catch (e) {
      console.error(
        `${row.rowNumber} - error extracting data extractor:${extractor.name} domain:${domain}`,
        e,
      )
      continue
    }
  }

  row.assign({
    to: HTMLEntities.unescape(foundSiteTitle || row.get("to").trim()),
    Headline: HTMLEntities.unescape(foundHeadline).replace("&bull;", "•"),
    Date: formatDate(foundPublicationDate),
    Byline: HTMLEntities.unescape(foundAuthors),

    // These should be left alone, but .assign() requires us to set them
    URL: url,
  })

  let attempts = 0

  while (true) {
    try {
      await row.save()
      break
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 429) {
        attempts++
        console.log("rate limited, waiting 5 seconds. attempts: ", attempts)
        await new Promise((resolve) => setTimeout(resolve, 5000))
        continue
      }

      console.error(`${row.rowNumber} - unknown error saving row`, e)
      break
    }
  }

  attempts = 0

  console.log(" ----------------------------------------")
}
