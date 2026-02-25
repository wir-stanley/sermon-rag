export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
  chat: `${API_URL}/api/chat`,
  chatStream: `${API_URL}/api/chat/stream`,
  conversations: `${API_URL}/api/conversations`,
  feedback: `${API_URL}/api/feedback`,
  health: `${API_URL}/api/health`,
} as const;

export const SUGGESTED_QUESTIONS = [
  "Apa kata Alkitab tentang kedaulatan Allah?",
  "Apa arti anugerah dalam teologi Reformed?",
  "Bagaimana orang Kristen memandang penderitaan?",
  "Jelaskan tentang pembenaran oleh iman",
  "Apa makna dari Perjamuan Kudus?",
  "Bagaimana kita harus berdoa menurut Alkitab?",
];
