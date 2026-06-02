# Entity Interaction & Logic Architecture Rules (CRITICAL)

- If the user instruction names an entity but DOES NOT provide the detailed initialization parameters required by the creation API, assume the entity is already created and configured.
- Missing initialization parameters include networking addresses, hardware IDs, baud rates, and similar setup details.
- Do NOT invoke "Create" or "Init" APIs with dummy or placeholder values.
- Skip directly to interacting with the entity using Action or Event APIs via its name.
- If `message()` is explicitly requested, default to `'rx'` as the prefix.
- **Socket APIs & Event Listening**:
  - For sending text data, use `socketSendString`, not `socketSend` (which expects an array).
  - For listening to socket events, use `socketAddListener(SOCKET_NAME, EVENT_NAME, CALLBACK)`.
  - Do NOT use undocumented listener functions like `onSocketReceive` or `on`.
  - Use exact socket event names: `'connection'` (when connected), `'data'` (when data is received), and `'close'` (when connection is closed).
- **Socket Prefix/Suffix Delimiters**:
  - When the instruction specifies a delimiter (like a newline) or start/end marker for receiving data, configure it using `socketSetPrefixSuffix(SOCKET_NAME, prefix, suffix)` before registering the `'data'` listener.
  - Example: `socketSetPrefixSuffix(SOCKET_NAME, '', '\n');` (for newline delimiter).
- **Logging Received Data**:
  - If explicitly requested to message, print, or log socket-received data, use `message('rx', data)` inside the event callback.
