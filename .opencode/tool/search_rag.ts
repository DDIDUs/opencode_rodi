/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"

const RODI_RAG_URL = process.env["RODI_RAG_URL"] ?? "http://129.254.222.37:10001/api/search/dense"
const REQUEST_TIMEOUT_MS = Number(process.env["RODI_RAG_TIMEOUT_MS"] ?? 15_000)
const CACHE_MAX = 200
const cache = new Map<string, unknown>()

export default tool({
  description: `Search Rodi Script API documentation using dense RAG.

Use this tool to verify exact Rodi API names, parameter order, option objects, event names, helper functions, return values, and examples before generating or reviewing Rodi Script code.`,
  args: {
    query: tool.schema.string().describe("Focused natural language query for Rodi Script API documentation"),
    limit: tool.schema.number().int().min(1).max(10).describe("Maximum number of search results to return").default(3),
  },
  async execute(args, ctx) {
    await ctx.ask({
      permission: "search_rag",
      patterns: ["*"],
      always: ["*"],
      metadata: { query: args.query, limit: args.limit },
    })

    const cacheKey = `${args.limit}:${args.query}`
    const cached = cache.get(cacheKey)
    if (cached !== undefined) {
      // Touch for LRU recency
      cache.delete(cacheKey)
      cache.set(cacheKey, cached)
      return {
        title: `Rodi RAG: ${args.query}`,
        output: JSON.stringify(cached, null, 2),
        metadata: { query: args.query, limit: args.limit, cached: true },
      }
    }

    const url = new URL(RODI_RAG_URL)
    url.searchParams.set("collection_name", "rodi_script_api_docs")
    url.searchParams.set("text", args.query)
    url.searchParams.set("limit", String(args.limit))

    const signal = AbortSignal.any([ctx.abort, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal,
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      const detail = body ? ` — ${body.slice(0, 200)}` : ""
      throw new Error(`Rodi RAG request failed: ${response.status} ${response.statusText}${detail}`)
    }

    const result = await response.json()
    if (cache.size >= CACHE_MAX) {
      const oldest = cache.keys().next().value
      if (oldest !== undefined) cache.delete(oldest)
    }
    cache.set(cacheKey, result)

    return {
      title: `Rodi RAG: ${args.query}`,
      output: JSON.stringify(result, null, 2),
      metadata: { query: args.query, limit: args.limit, cached: false },
    }
  },
})
