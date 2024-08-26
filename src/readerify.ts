import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"
import { Readability } from "https://esm.sh/@mozilla/readability"

export async function readerifyWebpage(url: string) {
	const res = await fetch(url)
	const html = await res.text()

	const doc = new DOMParser().parseFromString(html, "text/html")

	const reader = new Readability(doc, {
		// This causes Readability to return the full HTML content
		// serializer: (el) => el,
	})

	return reader.parse()
}
