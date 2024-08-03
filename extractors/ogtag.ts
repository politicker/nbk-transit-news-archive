import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"

export const extractFromOGTag = async (url: string): Promise<string[]> => {
	const res = await fetch(url)
	const html = await res.text()
	const doc = new DOMParser().parseFromString(html, "text/html")

	const titleMeta = doc.querySelector('meta[property="og:title"]')?.innerHTML
	const authorMeta = doc.querySelector('meta[property="article:author"]')
		?.innerHTML
	const publishedMeta = doc.querySelector(
		'meta[property="article:published_time"]',
	)?.innerHTML

	return [titleMeta ?? "", publishedMeta ?? "", authorMeta ?? ""]
}
