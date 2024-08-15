export async function dateFromURL(url: string) {
	const date = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//)
	if (!date) {
		return {}
	}

	const [_, year, month, day] = date
	const publicationDate = `${year}-${month}-${day}`

	return {
		publicationDate: publicationDate.trim(),
	}
}
