export function formatDate(isoDateString: string): string {
	if (!isoDateString) {
		return isoDateString
	}

	const date = new Date(isoDateString)
	if (isNaN(date.getTime())) {
		return ""
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	}
	return new Intl.DateTimeFormat("en-US", options).format(date)
}
