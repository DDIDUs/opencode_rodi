/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"

const RODI_RAG_URL = "http://129.254.222.37:10001/api/search/dense"
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
    if (cached) {
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

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: ctx.abort,
    })

    if (!response.ok) {
      throw new Error(`Rodi RAG request failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    cache.set(cacheKey, result)

    return {
      title: `Rodi RAG: ${args.query}`,
      output: JSON.stringify(result, null, 2),
      metadata: { query: args.query, limit: args.limit, cached: false },
    }
  },
})
