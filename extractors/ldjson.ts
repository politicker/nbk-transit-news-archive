import { DOMParser, Element } from "jsr:@b-fuze/deno-dom@0.1.47"
import { Graph, LDJSONRoot } from "../gothomist.d.ts"

export async function extractFromLDJSON(url: string) {
    const res = await fetch(url)
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, "text/html")
    const jsons = doc.querySelectorAll('script[type="application/ld+json"]')

    // TODO: There is a problem here. We have to essentially do the same thing that main.ts
    // does where we keep looping until we find the right data. We have to collect data bits
    // along the way as we loop. Return if we find everything, keep looping if we haven't.
    for (const json of jsons) {
        const maybeJSON = (json as Element).innerHTML

        let data: LDJSONRoot
        if (maybeJSON) {
            data = JSON.parse(maybeJSON)
        } else {
            continue
            return ["", "", ""] as const
        }

        const graphOrGraphRoot = ("@graph" in data) ? data["@graph"] : data
        if (Array.isArray(graphOrGraphRoot)) {
            for (const graph of graphOrGraphRoot) {
                if (!("author" in graph)) {
                    continue
                }

                return extractDataFromGraph(graph)
            }
        } else {
            return extractDataFromGraph(graphOrGraphRoot)
        }
    }

    // console.log("Date Published", publicationDate)
    // console.log("Authors", authors)
    // console.log("Headline", headline)

    return ["", "", ""] as const
}

function extractDataFromGraph(graph: Graph) {
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
