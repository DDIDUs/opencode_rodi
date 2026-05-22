/// <reference path="../env.d.ts" />
import type { Plugin } from "@opencode-ai/plugin"

const ROUTING_GUIDANCE = [
  "Routing policy:",
  "If the user's intent is to generate, transform, verify, or reason about Rodi Script or Rodi robot-controller behavior — including robot motion, poses/joints, IO control, sockets, entity interaction, repeated/conditional robot actions, or placeholder robot coordinates — delegate to the `rodi` subagent before answering. Classify by intent, not by surface keywords or input language.",
  "The `rodi` subagent owns RAG lookup and final Rodi code generation. Do not call WebFetch, WebSearch, or search_rag yourself for Rodi-related requests.",
].join("\n")

export default (async () => {
  return {
    async "tool.definition"(input, output) {
      if (input.toolID !== "task") return
      output.description = [output.description, "", ROUTING_GUIDANCE].join("\n")
    },
  }
}) satisfies Plugin
