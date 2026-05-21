/// <reference path="../env.d.ts" />
import type { Plugin } from "@opencode-ai/plugin"

const ROUTING_GUIDANCE = [
  "Routing policy:",
  "If the user's request is asking to produce, transform, verify, or reason about executable Rodi Script or robot-controller code, call the task tool with subagent `rodi` before answering.",
  "Treat the request as Rodi-related even when it is phrased in Korean or does not name Rodi explicitly, if it describes robot poses, joints, linear/joint/arc/circle movement, IO reads/writes, digital inputs/outputs, tool outputs, socket/entity behavior, wait conditions, repeated robot motion, or placeholder robot coordinates to be filled later.",
  "Do not use WebFetch, WebSearch, or search_rag directly from the main agent for Rodi-related requests. The `rodi` subagent owns RAG lookup and final Rodi code generation.",
].join("\n")

export default (async () => {
  return {
    async "tool.definition"(input, output) {
      if (input.toolID !== "task") return
      output.description = [output.description, "", ROUTING_GUIDANCE].join("\n")
    },
    async "chat.message"(input, output) {
      if (output.message.agent === "rodi") return
      if (input.agent === "rodi") return
      if (output.parts.some((part) => part.type === "agent" && part.name === "rodi")) return

      const firstText = output.parts.find((part) => part.type === "text" && !part.synthetic)
      if (!firstText) return

      firstText.text = [
        ROUTING_GUIDANCE,
        "",
        firstText.text,
      ].join("\n")
    },
  }
}) satisfies Plugin
