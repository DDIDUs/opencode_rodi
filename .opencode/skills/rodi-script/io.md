# IO Rules

- Carefully distinguish between Tool Digital Output (`setToolDigitalOutput`) and General Digital Output (`setGeneralDigitalOutput`). Use exactly the one requested.
- Digital input index defaults to `(0)`.
- Use `getGeneralDigitalInput(0)` unless instruction explicitly specifies a different index.
- When `start_condition` is used but no specific input index is given in the instruction, default to `getGeneralDigitalInput(0)`.
- Only use a different index if explicitly specified, e.g. "digital input 1" means `(1)`.
- **Return Value Handling**: When using an input reading API (like `getGeneralDigitalInput`) to evaluate a condition, ALWAYS assign its return value to a variable so it can be checked. Do not just call the function and discard the value.
- **Execution Order Strictness**: Follow the exact chronological order of operations specified in the instruction. If an output should be turned on *after* moving to a pose, place the `setToolDigitalOutput` call after the motion command, not before.
- **Multiple IO Changes (CRITICAL)**: When an instruction requires changing multiple digital outputs (general or tool) at the same time, you MUST group them using `setMultipleDigitalOutput` and the helper builders `ioDataGDO(port, value)` (for general outputs) and `ioDataTDO(port, value)` (for tool outputs). Do NOT generate separate sequential `setGeneralDigitalOutput` / `setToolDigitalOutput` calls.
  - Example:
    `var IO1=ioDataTDO(0,1); var IO2=ioDataGDO(1,0); setMultipleDigitalOutput([IO1,IO2]);`
