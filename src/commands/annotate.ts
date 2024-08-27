import { AxiosError } from "npm:axios"
import { extractors } from "../extractors/index.ts"
import { newSpreadsheet } from "../spreadsheet.ts"
import { formatDate } from "../utils.ts"
import * as HTMLEntities from "https://deno.land/std@0.224.0/html/entities.ts"
import { ExtractMetadataOptions } from "../../main.ts"
import { Row } from "./types.ts"

export async function annotateCommand(args: ExtractMetadataOptions) {
	if (!args.sheetId) {
		throw new Error("Sheet ID is required")
	}

	const alreadySeenDomains = new Set<string>()

	const sheet = await newSpreadsheet(args.sheetId)
	const rows = await sheet.getRows<Row>()

	for (const row of rows) {
		if (row.get("Headline")) {
			continue
		}

		const pageURL = row.get("URL")
		if (!pageURL) {
			continue
		}

		let url: URL
		try {
			url = new URL(pageURL)
		} catch (err: unknown) {
			console.error(`Error parsing URL ${pageURL}:`, err)
			continue
		}

		const domain = url.hostname
		if (args.domain && !domain.includes(args.domain)) {
			continue
		}

		if (args.processOnce) {
			if (alreadySeenDomains.has(domain)) {
				continue
			} else {
				alreadySeenDomains.add(domain)
			}
		}

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
				} = await extractor(pageURL)

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
			to: HTMLEntities.unescape(row.get("to").trim() || foundSiteTitle),
			Headline: row.get("Headline") ||
				HTMLEntities.unescape(foundHeadline).replace("&bull;", "•"),
			Date: row.get("Date") || formatDate(foundPublicationDate),
			Byline: row.get("Byline") || HTMLEntities.unescape(foundAuthors),

			// These should be left alone, but .assign() requires us to set them
			URL: pageURL,
			Archive: row.get("Archive") || "",
			Category: row.get("Category") || "",
			Notes: row.get("Notes") || "",
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
}
