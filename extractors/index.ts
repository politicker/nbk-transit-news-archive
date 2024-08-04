import { extractFromLDJSON } from "./ldjson.ts"
import { authorLink } from "./authorLink.ts"
import { extractFromOGTag } from "./metatag.ts"
import { extractFromPPS } from "./pps.ts"
import { dateFromURL } from "./urlDate.ts"

type ExtractorFn = (url: string) => Promise<readonly [string, string, string]>

export const extractors: ExtractorFn[] = [
	extractFromLDJSON,
	authorLink,
	extractFromOGTag,
	extractFromPPS,
	dateFromURL,
]
