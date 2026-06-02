---
name: rodi-script
description: Authoritative Rodi Script / Rodi robot-controller code-generation domain rules — motion (poses, joints, linear/arc/circle moves, jog, frames), IO control (digital in/out, multi-IO grouping), control flow (loops, sleep, async waiting, conditionals, start_condition), sockets/entities (listeners, message, prefix/suffix), and formatting/placeholder conventions. Load when generating, transforming, verifying, or reasoning about Rodi Script code.
---

# Rodi Script Domain Rules

Authoritative, single-source domain rules for generating executable Rodi Script. These mirror `mod_rodi/rodi_agent/prompts/system/domains` — keep them in sync with that directory; do not duplicate rules into the agent prompt.

Before producing final Rodi code, read the reference file(s) that match the task and follow them exactly. Do not rely on memory for domain specifics.

- [formatting.md](formatting.md) — variable naming, `_6` arrays, placeholder conventions, default motion parameters. **Consult for every code generation.**
- [motion.md](motion.md) — `moveLinear` / `moveJoint` / `moveCircle` / `moveArc`, jog, reference frames, parameter alignment for complex motions.
- [io.md](io.md) — digital input/output, `setMultipleDigitalOutput`, index defaults, execution order.
- [control_flow.md](control_flow.md) — `for` loops, `sleep`, async move waiting, wait-vs-check, `start_condition`, off-by-one.
- [entity.md](entity.md) — entities, sockets, event listeners, `message()`, prefix/suffix delimiters.

Load only the files relevant to the request: a motion+IO task reads `formatting.md`, `motion.md`, and `io.md`. A socket task reads `formatting.md` and `entity.md` (plus `control_flow.md` if conditional/event-driven).
