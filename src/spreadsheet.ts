import { JWT } from "npm:google-auth-library"
import { GoogleSpreadsheet } from "npm:google-spreadsheet"
import { loadGoogleCredentials } from "./utils.ts"

const credentials = await loadGoogleCredentials()

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
	email: credentials.client_email,
	key: credentials.private_key,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

export async function newSpreadsheet(id: string) {
	const spreadsheet = new GoogleSpreadsheet(
		id,
		serviceAccountAuth,
	)

	await spreadsheet.loadInfo()
	return spreadsheet.sheetsByTitle["Other"]
}
