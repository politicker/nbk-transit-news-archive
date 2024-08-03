import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
import "jsr:@std/dotenv/load"

export function add(a: number, b: number): number {
  return a + b
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    "https://gothamist.com/news/lost-evidence-biased-investigation-cited-in-nypds-probe-of-killed-cyclist-mathieu-lefevre",
  )

  console.log("visited page")
  await browser.close()
}
