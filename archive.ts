import { spreadsheet } from "./src/spreadsheet.ts"
import { checkStatus, LinkStatus } from "./src/linkChecker.ts" // Import the new function and enum
import { capturePDF, launchChromiumWithExtensions } from "./src/browser.ts"
import { savePDFLocally, uploadPDF } from "./src/storage.ts"
import { readerifyWebpage } from "./src/readerify.ts"

await spreadsheet.loadInfo()
const sheet = spreadsheet.sheetsByTitle["Other"]

const rows = await sheet.getRows()
const browser = await launchChromiumWithExtensions([])

for (const row of rows) {
	const url = row.get("URL")
	const u = new URL(url)
	const domain = u.hostname

	console.log(`${row.rowNumber} - checking status of ${domain}`)

	const status = await checkStatus(url)

	if (status === LinkStatus.DEAD) {
		console.log(
			`${row.rowNumber} - ${url} is dead. Looking up in the Internet Archive.`,
		)
		// Lookup in Internet Archive
		continue
	}

	console.log(`${row.rowNumber} - capturing ${domain} as pdf`)

	try {
		const pdfBytes = await capturePDF(browser, url)
		savePDFLocally(pdfBytes, u.href)
		// await uploadPDF(pdfBytes, u.href)
	} catch (err: unknown) {
		console.error(`Error uploading PDF for ${domain}:`, err)
	}
}

await browser.close()
