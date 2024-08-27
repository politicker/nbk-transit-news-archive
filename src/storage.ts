import { Storage } from "npm:@google-cloud/storage"
import { loadGoogleCredentials } from "./utils.ts"

async function newStorageClient() {
	const credentials = await loadGoogleCredentials()

	return new Storage({
		projectId: credentials.project_id,
		credentials: {
			client_email: credentials.client_email,
			private_key: credentials.private_key,
		},
	})
}

function normalizeFilename(url: string): string {
	// Remove the scheme (http:// or https://)
	let normalized = url.replace(/^https?:\/\//, "")

	// Replace slashes with underscores
	normalized = normalized.replace(/\//g, "_")

	// Replace special characters with underscores or remove them
	normalized = normalized.replace(/[?&#:;,.]/g, "")

	// Convert to lowercase
	normalized = normalized.toLowerCase()

	// Trim any leading or trailing underscores
	normalized = normalized.replace(/^_+|_+$/g, "")

	return normalized
}

export function savePDFLocally(
	pdfBytes: Uint8Array,
	rawFilename: string,
) {
	const filename = normalizeFilename(rawFilename) + ".pdf"
	const path = "./pdfs/" + filename

	Deno.writeFileSync(path, pdfBytes)
}

export async function uploadToGCS(pdfBytes: Uint8Array, rawFilename: string) {
	const storage = await newStorageClient()
	const bucketName = Deno.env.get("STORAGE_BUCKET")

	if (!bucketName) {
		throw new Error("STORAGE_BUCKET environment variable is not set")
	}

	const filename = normalizeFilename(rawFilename) + ".pdf"
	const file = storage.bucket(bucketName).file(filename)

	await file.save(pdfBytes, {
		metadata: {
			contentType: "application/pdf",
		},
		resumable: false, // Optional: use resumable uploads for large files
	})
}
