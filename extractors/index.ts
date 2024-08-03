import { Page } from "jsr:@astral/astral"
import { extractFromLDJSON } from "./ldjson.ts"

type ExtractorFn = (url: string) => Promise<readonly [string, string, string]>

export const extractors: ExtractorFn[] = [
	extractFromLDJSON,
]
