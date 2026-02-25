// Matches backend Pydantic schemas exactly

export interface SourceCitation {
  source_id: number;
  title: string;
  speaker: string | null;
  sermon_date: string | null;
  sermon_number: string | null;
  source_type: "pdf_morning" | "pdf_afternoon" | "youtube";
  relevance_score: number;
  excerpt: string;
  page_or_timestamp: string | null;
}

export interface ChatRequest {
  question: string;
  language?: string;
  conversation_id?: number;
}

export interface ChatResponse {
  answer: string;
  citations: SourceCitation[];
  language: string;
}

export interface FeedbackOut {
  id: number;
  is_positive: boolean;
  comment: string | null;
  created_at: string;
}

export interface ChatMessageOut {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations: SourceCitation[] | null;
  language: string | null;
  created_at: string;
  feedback: FeedbackOut | null;
}

export interface ConversationSummary {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessageOut[];
}

export interface FeedbackRequest {
  message_id: number;
  is_positive: boolean;
  comment?: string;
}

// SSE event types
export type SSEEvent =
  | { type: "conversation"; conversation_id: number }
  | { type: "token"; content: string }
  | { type: "citations"; data: SourceCitation[] }
  | { type: "message_id"; id: number }
  | { type: "done" };

// Local message type for UI state (before persistence)
export interface Message {
  id: string; // client-side ID (or server ID once persisted)
  role: "user" | "assistant";
  content: string;
  citations?: SourceCitation[];
  isStreaming?: boolean;
  feedback?: FeedbackOut | null;
  serverMessageId?: number;
}
