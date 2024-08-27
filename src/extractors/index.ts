import { extractFromLDJSON } from "./ldjson.ts"
import { authorLink } from "./authorLink.ts"
import { extractFromOGTag } from "./metatag.ts"
import { extractFromPPS } from "./pps.ts"
import { dateFromURL } from "./urlDate.ts"

export interface ExtractedData {
	headline?: string | null
	publicationDate?: string | null
	author?: string | null
	siteTitle?: string | null
}

type ExtractorFn = (url: string) => Promise<ExtractedData>

export const extractors: ExtractorFn[] = [
	extractFromLDJSON,
	authorLink,
	extractFromOGTag,
	extractFromPPS,
	dateFromURL,
]
