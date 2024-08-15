import { DOMParser, Element } from "jsr:@b-fuze/deno-dom@0.1.47"

export async function authorLink(url: string) {
    const res = await fetch(url)
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, "text/html")
    const links = doc.querySelectorAll('a[href*="/author"]')

    for (const link of links) {
        const a = link as Element
        if (a.innerText !== "") {
            return {
                author: a.innerText.trim(),
            }
        }
    }

    return {}
}
