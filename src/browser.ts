import { Browser, launch } from "jsr:@astral/astral"

// Define a function to launch Chromium with the necessary extensions
export async function launchChromiumWithExtensions(
	extensions: string[],
): Promise<Browser> {
	// TODO: Eventually, maybe.
	const extensionPaths = extensions.join(",")

	const extensionPath =
		"/Users/harrison/Library/Application Support/Google/Chrome/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.59.0_0"

	const chromePath =
		"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

	// Command to launch Chromium with the provided extensions
	const command = new Deno.Command(chromePath, {
		args: [
			// "--headless=new",
			"--no-first-run",
			"--password-store=basic",
			"--use-mock-keychain",
			"--hide-scrollbars",
			"--disable-gpu",
			"--remote-debugging-port=1337",
			`--load-extension=${extensionPath}`,
		],
	})

	// Spawn the process and get the child process object
	command.spawn()

	// Wait for the process to startup
	await new Promise((resolve) => setTimeout(resolve, 3000))

	// Fetch the WebSocket Debugging URL
	const res = await fetch("http://localhost:1337/json/version")
	const data = await res.json()
	const wsEndpoint = data.webSocketDebuggerUrl

	return await launch({
		wsEndpoint: wsEndpoint,
		headless: false,
	})
}

// Function to navigate to a URL and capture a PDF
export async function capturePDF(
	browser: Browser,
	url: string,
): Promise<Uint8Array> {
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: "load" })

	const pdf = await page.pdf({
		// format: "A4",
		printBackground: false,
	})

	await page.close()

	return pdf
}
