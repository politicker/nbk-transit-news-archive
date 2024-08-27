import { parse } from "https://deno.land/std@0.84.0/flags/mod.ts"

export interface CommandArgs {
	help: boolean
	"save-gcs": boolean
	"process-once": boolean
	domain?: string
	"sheet-id": string
	"sheet-name": string
	"internet-archive": boolean
	_: string[] // This will capture any non-flag arguments
	"--"?: string[] // This captures arguments after "--"
}

export function parseArguments(args: string[]): CommandArgs {
	const booleanArgs = [
		"help",
		"save-gcs",
		"process-once",
	]

	const stringArgs = [
		"domain",
		"sheet-id",
		"sheet-name",
	]

	const alias = {
		"help": "h", // Display help information
		"save-gcs": "r", // Save PDF files gcs (vs in GCP)
		"process-once": "o", // Only process each URL one time
		"domain": "d", // Only process URLs from certain domain
		"sheet-id": "i", // Pass in the ID of the Google Workbook
		"sheet-name": "n", // Pass in the name of the Google Sheet
		"internet-archive": "a", // Look up a dead link in the Internet Archive or not
	}

	return parse(args, {
		alias,
		boolean: booleanArgs,
		string: stringArgs,
		stopEarly: false,
		"--": true,
	}) as CommandArgs
}

export function printHelp(): void {
	console.log(`Usage: mycli [OPTIONS...]`)
	console.log("\nOptional flags:")
	console.log("  -h, --help                Display this help and exit")
	console.log(
		"  -l, --save-locally        Save PDF files locally instead of in GCP",
	)
	console.log("  -o, --process-once        Only process each URL one time")
	console.log(
		"  -d, --domain [DOMAIN]     Only process URLs from the specified domain",
	)
	console.log("  -i, --sheet-id [ID]       Pass in the ID of the Google Sheet")
	console.log(
		"  -n, --sheet-name [NAME]   Pass in the name of the Google Sheet",
	)
	console.log(
		"  -a, --internet-archive    Look up a dead link in the Internet Archive",
	)
}
