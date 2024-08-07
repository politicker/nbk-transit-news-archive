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
