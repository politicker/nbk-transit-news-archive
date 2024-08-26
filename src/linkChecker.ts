// Define an enum for the status
export enum LinkStatus {
	VALID = "valid",
	DEAD = "dead",
}

export async function checkStatus(url: string): Promise<LinkStatus> {
	try {
		const response = await fetch(url, { method: "HEAD", redirect: "manual" })

		// Handle the valid case
		if (response.status === 200) {
			return LinkStatus.VALID
		}

		// Handle the redirect case by checking the final destination
		if (response.status === 301 || response.status === 302) {
			const finalUrl = response.headers.get("location")
			if (finalUrl) {
				const finalResponse = await fetch(finalUrl, { method: "HEAD" })
				return finalResponse.status === 200 ? LinkStatus.VALID : LinkStatus.DEAD
			}
		}

		// For all other cases, consider the link as dead
		return LinkStatus.DEAD
	} catch (error) {
		console.error(`Error checking status of ${url}:`, error)
		return LinkStatus.DEAD
	}
}
