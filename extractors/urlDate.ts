export async function dateFromURL(url: string) {
	const date = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//)
	if (!date) {
		return ["", "", ""] as const
	}

	const [_, year, month, day] = date
	const publishedAt = `${year}-${month}-${day}`

	return ["", publishedAt, ""] as const
}
