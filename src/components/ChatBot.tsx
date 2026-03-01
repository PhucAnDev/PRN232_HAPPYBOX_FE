import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Package,
  ShoppingCart,
  HelpCircle,
  Gift,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import chatbotService, { ProductSuggestion } from "../services/chatbotService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  productSuggestions?: ProductSuggestion[];
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của TếtĐếnRồi.vn 🎁\n\nTôi có thể giúp bạn:\n• Tư vấn chọn quà Tết\n• Tra cứu đơn hàng\n• Hỗ trợ thanh toán\n• Giải đáp thắc mắc",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Gợi ý quà Tết doanh nghiệp",
        "Kiểm tra đơn hàng",
        "Chính sách đổi trả",
        "Liên hệ tư vấn",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Call BE API
      const response = await chatbotService.sendMessage(messageToSend);

      if (response.data.success && response.data.data) {
        const botResponse: Message = {
          id: Date.now().toString(),
          text: response.data.data.response,
          sender: "bot",
          timestamp: new Date(),
          productSuggestions: response.data.data.productSuggestions,
        };

        setMessages((prev: Message[]) => [...prev, botResponse]);
      } else {
        // Fallback error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 1900 8888 để được hỗ trợ.",
          sender: "bot",
          timestamp: new Date(),
          suggestions: ["Thử lại", "Liên hệ hotline"],
        };
        setMessages((prev: Message[]) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau hoặc liên hệ hotline 1900 8888.",
        sender: "bot",
        timestamp: new Date(),
        suggestions: ["Thử lại", "Liên hệ hotline"],
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Auto-send when clicking suggestion
    setTimeout(() => {
      const event = new KeyboardEvent("keypress", { key: "Enter" });
      handleKeyPress(event as any);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            zIndex: 50
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Trợ Lý AI
                </h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-white/80 text-xs">Đang hoạt động</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FFFDF5] to-white">
            {messages.map((message: Message) => (
              <div key={message.id}>
                <div
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "bot"
                        ? "bg-gradient-to-br from-[#D4AF37] to-[#B8942E]"
                        : "bg-gradient-to-br from-[#B71C1C] to-[#8B1538]"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <Sparkles className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] ${
                      message.sender === "user" ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === "bot"
                          ? "bg-white border border-gray-200 shadow-sm"
                          : "bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white"
                      }`}
                    >
                      <p
                        className={`text-sm whitespace-pre-line ${
                          message.sender === "bot"
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Product Suggestions */}
                    {message.productSuggestions &&
                      message.productSuggestions.length > 0 && (
                        <div className="mt-3 space-y-2 w-full">
                          <p className="text-xs font-semibold text-gray-600 px-1">
                            Sản phẩm gợi ý:
                          </p>
                          {message.productSuggestions.map(
                            (product: ProductSuggestion) => (
                              <div
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#D4AF37] transition-all cursor-pointer"
                              >
                                <div className="flex gap-3">
                                  {product.imageUrl && (
                                    <img
                                      src={product.imageUrl}
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {product.description}
                                    </p>
                                    <p className="text-sm font-bold text-[#B71C1C] mt-1">
                                      {formatCurrency(product.price)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                    {/* Text Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 bg-white border border-[#D4AF37] text-[#B71C1C] rounded-full text-xs font-medium hover:bg-[#D4AF37] hover:text-white transition-all transform hover:scale-105"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8942E] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleSuggestionClick("Xem sản phẩm mới")}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-[#D4AF37] hover:text-[#B71C1C] transition-colors whitespace-nowrap"
              >
                <Package className="h-3 w-3" />
                Sản phẩm
              </button>
              <button
                onClick={() => handleSuggestionClick("Kiểm tra đơn hàng")}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-[#D4AF37] hover:text-[#B71C1C] transition-colors whitespace-nowrap"
              >
                <ShoppingCart className="h-3 w-3" />
                Đơn hàng
              </button>
              <button
                onClick={() => handleSuggestionClick("Xem ưu đãi hiện tại")}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-[#D4AF37] hover:text-[#B71C1C] transition-colors whitespace-nowrap"
              >
                <Gift className="h-3 w-3" />
                Ưu đãi
              </button>
              <button
                onClick={() => handleSuggestionClick("Tôi cần hỗ trợ")}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-[#D4AF37] hover:text-[#B71C1C] transition-colors whitespace-nowrap"
              >
                <HelpCircle className="h-3 w-3" />
                Hỗ trợ
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="border-gray-300 rounded-xl resize-none"
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] group"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7 text-white" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-white">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-[#B71C1C] animate-ping opacity-30"></div>
          </>
        )}
      </button>
    </>
  );
}
