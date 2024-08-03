import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"

export const extractFromOGTag = async (url: string): Promise<string[]> => {
	const res = await fetch(url)
	const html = await res.text()
	const doc = new DOMParser().parseFromString(html, "text/html")

	const title = doc.querySelector('meta[property="og:title"]')?.innerHTML
	const author = doc.querySelector('meta[property="article:author"]')
		?.innerHTML
	const publishedAt = doc.querySelector(
		'meta[property="article:published_time"]',
	)?.innerHTML

	return [title ?? "", publishedAt ?? "", author ?? ""]
}
