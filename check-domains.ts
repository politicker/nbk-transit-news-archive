import { DOMParser, Element } from "jsr:@b-fuze/deno-dom@0.1.47"

// read the urls.txt file and split by new line
const urls = Deno.readTextFileSync("urls.txt").split("\n")

console.log("launching browser")

const finishedDomains = new Set<string>()
for (const url of urls) {
    const u = new URL(url)
    const domain = u.hostname.replace("www.", "")

    if (!finishedDomains.has(domain)) {
        finishedDomains.add(domain)
    } else {
        continue
    }

    console.log("checking domain", domain)
    // fetch the contents of the url
    const res = await fetch(url)
    const html = await res.text()
    // parse the html
    const doc = new DOMParser().parseFromString(html, "text/html")
    // get all og props
    // const ogTags = doc.querySelectorAll('meta[property*="og:"]')
    // for (const tag of ogTags) {
    //     console.log(
    //         "ohhi!",
    //         (tag as Element).getAttribute("property"),
    //         (tag as Element).getAttribute("content"),
    //     )
    // }

    // const articleTags = doc.querySelectorAll('meta[property*="article:"]')
    // for (const tag of articleTags) {
    //     console.log(
    //         (tag as Element).getAttribute("property"),
    //         (tag as Element).getAttribute("content"),
    //     )
    // }

    const authorTags = doc.querySelectorAll('meta[name="author"]')
    for (const tag of authorTags) {
        console.log(
            (tag as Element).getAttribute("property"),
            (tag as Element).getAttribute("content"),
        )
    }
}

const domains = urls.reduce<string[]>((acc, url) => {
    const u = new URL(url)
    const domain = u.hostname.replace("www.", "")

    if (!acc.includes(domain)) {
        acc.push(domain)
    }
    return acc
}, [])

console.log(domains.sort().length)
