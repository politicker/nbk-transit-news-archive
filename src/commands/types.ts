export interface Row {
	to: string // publication (e.g. NY Times)
	Date: string // date published
	Byline: string // author
	Headline: string // article headline
	URL: string // url of the article
	Category: string
	Notes: string
	Archive: string // GCS url of the archived PDF file
}
