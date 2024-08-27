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

export const spreadsheet = new GoogleSpreadsheet(
	"1QvWha8j4O9E1WI-ROAojqdWAUfY4ZvaVh0V0AIleuwY", // real sheet :O
	serviceAccountAuth,
)
