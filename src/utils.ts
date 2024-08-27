import { readJson } from "https://deno.land/std@0.66.0/fs/read_json.ts"

export function formatDate(isoDateString: string): string {
	const date = new Date(isoDateString)
	if (isNaN(date.getTime())) {
		return isoDateString
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	}
	return new Intl.DateTimeFormat("en-US", options).format(date)
}

interface GoogleCredentials {
	client_email: string
	private_key: string
	project_id: string
}

export async function loadGoogleCredentials(): Promise<GoogleCredentials> {
	return await readJson("credentials.json") as GoogleCredentials
}
