import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"

export async function extractFromOGTag(url: string) {
	const res = await fetch(url)
	const html = await res.text()
	const doc = new DOMParser().parseFromString(html, "text/html")

	let title = doc.querySelector('meta[property="og:title"]')?.getAttribute(
		"content",
	)

	if (!title) {
		title = doc.querySelector("title")?.innerText
	}

	let author = doc.querySelector('meta[property="article:author"]')
		?.getAttribute("content")

	if (!author) {
		author = doc.querySelector('meta[name="author"]')?.getAttribute(
			"content",
		)
	}

	const publishedAt = doc.querySelector(
		'meta[property="article:published_time"]',
	)?.getAttribute("content")

	return [title ?? "", publishedAt ?? "", author ?? ""] as const
}
