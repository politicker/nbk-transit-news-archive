import "jsr:@std/dotenv/load"
import { archiveWebpage } from "./src/commands/archive-webpage.ts"
import { extractMetadataFromWebpage } from "./src/commands/extract-metadata.ts"
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts"

interface CommandArgs {
  sheetId?: string
  sheetName?: string
  domain?: string
  processOnce?: boolean
}

export interface ArchiveOptions extends CommandArgs {
  storeInGCS?: boolean
  useArchive?: boolean
}

export interface ExtractMetadataOptions extends CommandArgs {}

await new Command()
  .name("nbk")
  .version("1.0.0")
  .description("CLI tool for archiving and extracting metadata from web pages")
  .command("archive", "Archive webpages as PDFs and store them in GCS")
  .option("-id, --sheet-id <sheetId:string>", "The ID of the Google Sheet")
  .option("-n, --sheet-name <sheetName:string>", "The name of the Google Sheet")
  .option(
    "-d, --domain=<domain:string>",
    "Only process URLs from the specified domain",
  )
  .option("--process-once", "Only process each URL one time")
  // These are specific to the archive command
  .option("--use-archive", "Use the Internet Archive for dead links")
  .option("--store-in-gcs", "Store the PDFs in Google Cloud Storage")
  .action((options: ArchiveOptions) => {
    archiveWebpage(options)
  })
  .command(
    "annotate",
    "Annotate spreadsheet rows with metadata from web pages",
  )
  .option("-id, --sheet-id <sheetId:string>", "The ID of the Google Sheet")
  .option("-n, --sheet-name <sheetName:string>", "The name of the Google Sheet")
  .option(
    "-d, --domain=<domain:string>",
    "Only process URLs from the specified domain",
  )
  .option("--process-once", "Only process each URL one time")
  .action((options: ExtractMetadataOptions) => {
    extractMetadataFromWebpage(options)
  })
  .parse(Deno.args)
