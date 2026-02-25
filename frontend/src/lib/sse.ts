import { API_ROUTES } from "./constants";
import type { ChatRequest, SSEEvent } from "@/types";

/**
 * POST-based SSE stream parser.
 * EventSource only supports GET, but our backend uses POST for /api/chat/stream.
 * We use fetch + ReadableStream to parse the SSE text/event-stream response.
 */
export async function* streamChat(
  request: ChatRequest,
  token?: string
): AsyncGenerator<SSEEvent> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_ROUTES.chatStream, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Stream error ${response.status}: ${body}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const jsonStr = trimmed.slice(6); // Remove "data: " prefix
        if (jsonStr === "[DONE]") return;

        try {
          const event: SSEEvent = JSON.parse(jsonStr);
          yield event;
        } catch {
          // Skip malformed JSON lines
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim().startsWith("data: ")) {
      const jsonStr = buffer.trim().slice(6);
      if (jsonStr !== "[DONE]") {
        try {
          yield JSON.parse(jsonStr);
        } catch {
          // Skip malformed
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
