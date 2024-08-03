import { launch } from "jsr:@astral/astral"
import "jsr:@std/dotenv/load"

console.log("launching browser")
const browser = await launch({
  headless: false,
})
console.log("browser launched")
const page = await browser.newPage(
  "https://gothamist.com/news/lost-evidence-biased-investigation-cited-in-nypds-probe-of-killed-cyclist-mathieu-lefevre",
  {
    waitUntil: "load",
  },
)
console.log("page opened")

const json = await page.$('script[type="application/ld+json"]')
const maybjson = await json?.innerHTML()

let data
if (maybjson) {
  data = JSON.parse(maybjson)
}

console.log(data)

console.log("visited page")
await browser.close()
