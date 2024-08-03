import { extractFromLDJSON } from "./ldjson.ts"
import { authorLink } from "./authorLink.ts"
import { extractFromOGTag } from "./ogtag.ts"
import { extractFromPPS } from "./pps.ts"

type ExtractorFn = (url: string) => Promise<readonly [string, string, string]>

export const extractors: ExtractorFn[] = [
	extractFromLDJSON,
	authorLink,
	extractFromOGTag,
	extractFromPPS,
]
