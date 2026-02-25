import { API_ROUTES } from "./constants";
import type {
  ConversationDetail,
  ConversationSummary,
  FeedbackOut,
  FeedbackRequest,
} from "@/types";

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { cache: "no-store", ...options, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Conversations
export function getConversations(token?: string) {
  return fetchApi<ConversationSummary[]>(API_ROUTES.conversations, {}, token);
}

export function getConversation(id: number, token?: string) {
  return fetchApi<ConversationDetail>(
    `${API_ROUTES.conversations}/${id}`,
    {},
    token
  );
}

export function renameConversation(
  id: number,
  title: string,
  token?: string
) {
  return fetchApi<ConversationSummary>(
    `${API_ROUTES.conversations}/${id}`,
    { method: "PATCH", body: JSON.stringify({ title }) },
    token
  );
}

export function deleteConversation(id: number, token?: string) {
  return fetchApi<void>(
    `${API_ROUTES.conversations}/${id}`,
    { method: "DELETE" },
    token
  );
}

// Feedback
export function submitFeedback(data: FeedbackRequest, token?: string) {
  return fetchApi<FeedbackOut>(API_ROUTES.feedback, {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
}
