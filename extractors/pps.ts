import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.47"

export async function extractFromPPS(url: string) {
	const res = await fetch(url)
	const html = await res.text()
	const doc = new DOMParser().parseFromString(html, "text/html")

	let authorsElm = doc.querySelector(
		"body > div.s-blogsection > div:nth-child(4) > div > div:nth-child(1) > p:nth-child(1)",
	)

	if (!authorsElm) {
		authorsElm = doc.querySelector(
			"body > div.s-blogsection > div.b-bloginfo4 > div > div.div-block-138 > div.t-bodys.is--darkred.is--bold.is--padding",
		)
	}

	const author = authorsElm?.textContent

	const publicationDate = doc.querySelector(
		"body > div.s-blogsection > div.b-bloginfo4 > div > div:nth-child(2)",
	)?.textContent

	return {
		publicationDate: publicationDate?.trim(),
		author: author?.trim(),
	}
}
