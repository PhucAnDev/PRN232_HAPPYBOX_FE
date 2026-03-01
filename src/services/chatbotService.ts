import api from "./api";

// ====== Types ======
export interface ProductSuggestion {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface ChatMessageResponse {
  response: string;
  productSuggestions?: ProductSuggestion[];
}

export interface ChatMessageRequest {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const chatbotService = {
  // POST /api/Chatbot/chat
  sendMessage: (message: string) =>
    api.post<ApiResponse<ChatMessageResponse>>("/Chatbot/chat", {
      message,
    } as ChatMessageRequest),
};

export default chatbotService;
