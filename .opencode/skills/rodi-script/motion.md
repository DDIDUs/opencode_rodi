# Motion Semantics & Parameter Rules (CRITICAL)

- **"based on TCP" ALWAYS means motion reference frame, NOT socket communication**:
  - When user says "based on TCP" for motion commands, use `'tcp'` as the frame parameter.
  - "based on TCP" does NOT mean create a socket connection.
  - This is a MOTION FRAME specification, not networking.
- If the description indicates a default value (e.g. `100 max velocity`, `true`), treat that initial token as the default value to initialize your variable with.
- If an API requires a pose type (`'flange'` vs `'tcp'`) but the user instruction does NOT specify which one to use, **ALWAYS default to `'flange'`**.
- **Parameter Alignment for Complex Motions**: When passing an option object (like `{async_mode: true}` or `{start_condition: ...}`) to complex motion APIs (like `moveCircle` or `moveArc`), you **MUST NOT** omit intermediate optional parameters (such as start velocity `s_v` and end velocity `e_v`). Doing so shifts the option object into a velocity parameter slot, which causes execution errors.
  - Correct:
    `moveCircle('flange', VIA_POSE, TARGET_POSE, DEFAULT_M_V, DEFAULT_M_A, DEFAULT_S_V, DEFAULT_E_V, {async_mode: true});`
  - Wrong:
    `moveCircle('flange', VIA_POSE, TARGET_POSE, {async_mode: true});`
- **Diagonal & Combined Motions**: If requested to move in a combined or diagonal direction (e.g. `1, -1, 0`), execute it as a **single** motion command. Do NOT split it into sequential single-axis motions.
- **API Selection Constraints**:
  - Use `moveLinear` for straight-line motions to a single target. Do not use `moveCircle` unless explicitly creating a circular motion through points.
  - Use `jogInching` ONLY for translational movement (mm). Use `jogInchingOrientation` ONLY for rotational movement (degrees). Do not confuse the two.
- All motion commands except joint moves, when specifying motion parameters, must explicitly include velocity and acceleration parameters.
- For `createDirection`, pass exactly three positional numeric arguments (`x`, `y`, `z`), not an object.
- Use `waitForMoveEnd(COMMAND_ID)` only when the user explicitly requests waiting for an asynchronous motion to complete. Never use undocumented wait functions.
- You should not provide velocity and acceleration parameters to moveJoint.
