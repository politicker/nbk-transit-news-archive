import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"

export async function extractFromOGTag(url: string) {
	const res = await fetch(url)
	const html = await res.text()
	const doc = new DOMParser().parseFromString(html, "text/html")

	let headline = doc.querySelector('meta[property="og:title"]')?.getAttribute(
		"content",
	)

	if (!headline) {
		headline = doc.querySelector("title")?.innerText
	}

	let author = doc.querySelector('meta[property="article:author"]')
		?.getAttribute("content")

	if (!author) {
		author = doc.querySelector('meta[name="author"]')?.getAttribute(
			"content",
		)
	}

	const publicationDate = doc.querySelector(
		'meta[property="article:published_time"]',
	)?.getAttribute("content")

	const siteTitle = doc.querySelector('meta[property="og:site_name"]')
		?.getAttribute("content")

	return {
		headline: headline?.trim(),
		publicationDate: publicationDate?.trim(),
		author: author?.trim(),
		siteTitle: siteTitle?.trim(),
	}
}
