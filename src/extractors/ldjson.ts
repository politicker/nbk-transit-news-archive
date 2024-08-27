import { DOMParser, Element } from "jsr:@b-fuze/deno-dom@0.1.47"
import { Graph } from "../../gothomist.d.ts"

export async function extractFromLDJSON(url: string) {
    const res = await fetch(url)
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, "text/html")
    const jsonScriptTags = doc.querySelectorAll(
        'script[type="application/ld+json"]',
    )

    const authors: string[] = []
    let headline = ""
    let publicationDate = ""

    for (const json of jsonScriptTags) {
        if (authors.length && headline && publicationDate) break

        const maybeJSON = (json as Element).innerHTML
        if (!maybeJSON) continue

        const data = JSON.parse(maybeJSON)
        const graphOrGraphRoot = data["@graph"] ?? data

        const graphs = Array.isArray(graphOrGraphRoot)
            ? graphOrGraphRoot
            : [graphOrGraphRoot]
        for (const graph of graphs) {
            if (!("author" in graph)) continue

            const [foundHeadline, foundPublicationDate, foundAuthor] =
                extractDataFromGraph(graph)

            if (foundAuthor) authors.push(foundAuthor)
            if (!headline && foundHeadline) headline = foundHeadline
            if (!publicationDate && foundPublicationDate) {
                publicationDate = foundPublicationDate
            }

            if (authors.length && headline && publicationDate) break
        }
    }

    return {
        headline: headline.trim(),
        publicationDate: publicationDate.trim(),
        author: authors.join(", "),
    }
}

function extractDataFromGraph(graph: Graph): [string, string, string] {
    const authors: string[] = []
    let headline: string = ""
    let publicationDate: string = ""

    headline = graph.headline ?? ""
    publicationDate = graph.datePublished ?? ""

    const authorData = graph.author
    if (!authorData) {
        return ["", "", ""] as const
    }

    if (Array.isArray(authorData)) {
        for (const author of authorData) {
            authors.push(author.name)
        }
    } else if (typeof authorData === "string") {
        authors.push(authorData)
    } else {
        authors.push(authorData.name)
    }

    return [headline, publicationDate, authors.join(", ")] as const
}
