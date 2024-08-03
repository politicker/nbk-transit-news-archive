import { extractFromLDJSON } from "./ldjson.ts"
import { authorLink } from "./authorLink.ts"

type ExtractorFn = (url: string) => Promise<readonly [string, string, string]>

export const extractors: ExtractorFn[] = [
	extractFromLDJSON,
	authorLink,
]
