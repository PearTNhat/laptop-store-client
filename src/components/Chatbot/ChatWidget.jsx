import React, { useState, useEffect, useRef } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaRedo,
  FaMinus
} from "react-icons/fa";
import { apiSendChatMessage, apiGetChatHistory } from "~/apis/chat";
import ChatMessage from "./ChatMessage";

const STORAGE_KEY_CONV = "laptop_chatbot_conv_id";
const STORAGE_KEY_MSGS = "laptop_chatbot_msgs";

const INITIAL_MESSAGE = {
  role: "model",
  content:
    "Chào bạn! Em là trợ lý AI của Laptop Store 🤖\nBạn đang tìm laptop theo tầm giá hay nhu cầu nào (học tập, đồ họa, gaming, văn phòng...) để em hỗ trợ tư vấn ngay nhé?",
  products: [],
  timestamp: new Date().toISOString()
};

const QUICK_PROMPTS = [
  "Laptop sinh viên dưới 15 triệu",
  "Laptop Gaming cấu hình cao",
  "Máy mỏng nhẹ văn phòng pin trâu",
  "Chính sách bảo hành của cửa hàng"
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_MSGS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed.filter((m) => m && typeof m === "object" && m.content)
        : [INITIAL_MESSAGE];
    } catch {
      return [INITIAL_MESSAGE];
    }
  });
  const [conversationId, setConversationId] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_CONV) || "";
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Lưu tin nhắn vào sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
      if (conversationId) {
        sessionStorage.setItem(STORAGE_KEY_CONV, conversationId);
      }
    } catch (e) {
      console.warn("Could not save to sessionStorage", e);
    }
  }, [messages, conversationId]);

  // Khôi phục lịch sử từ server nếu có conversationId mà chưa nạp
  useEffect(() => {
    if (conversationId && messages.length <= 1) {
      apiGetChatHistory(conversationId).then((res) => {
        if (res?.success && res.messages?.length > 0) {
          setMessages(res.messages);
        }
      });
    }
  }, [conversationId]);

  // Xử lý gửi tin nhắn
  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage("");

    // Thêm tin nhắn của user vào UI ngay lập tức
    const userMsg = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await apiSendChatMessage({
        message: text,
        conversationId
      });

      if (response?.success) {
        if (response.conversationId && response.conversationId !== conversationId) {
          setConversationId(response.conversationId);
        }

        const modelMsg = {
          role: "model",
          content: response.reply,
          products: response.products || [],
          sources: response.sources || [],
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        const errorMsg = {
          role: "model",
          content:
            response?.error?.message ||
            "Dạ hiện tại em đang gặp chút gián đoạn khi xử lý câu hỏi. Bạn vui lòng thử lại sau giây lát nhé!",
          products: [],
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Không thể kết nối đến máy chủ AI, bạn vui lòng kiểm tra kết nối mạng hoặc thử lại sau nhé.",
          products: [],
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Làm mới cuộc hội thoại
  const handleResetChat = () => {
    sessionStorage.removeItem(STORAGE_KEY_CONV);
    sessionStorage.removeItem(STORAGE_KEY_MSGS);
    setConversationId("");
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút tròn nổi mở Chatbox */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105"
          title="Tư vấn cùng AI Chatbot"
        >
          <FaComments className="text-2xl" />
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
          </span>
          {/* Tooltip khi rê chuột */}
          <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
            Cần tư vấn laptop? Chat với AI ngay!
          </span>
        </button>
      )}

      {/* Cửa sổ Chatbox */}
      {isOpen && (
        <div className="flex flex-col w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-red-600 text-white p-3.5 flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-xl" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Trợ Lý Tư Vấn Laptop AI
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                </div>
                <div className="text-[11px] text-red-100">
                  Tư vấn cấu hình, giá & chính sách
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Bắt đầu cuộc trò chuyện mới"
              >
                <FaRedo className="text-xs" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Đóng chat"
              >
                <FaMinus className="text-xs" />
              </button>
            </div>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-grow overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
            {messages
              .filter((msg) => msg && msg.content)
              .map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}

            {isLoading && <ChatMessage isTyping={true} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh (Quick Prompts) */}
          {messages.length <= 2 && !isLoading && (
            <div className="p-2 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="text-[11px] text-gray-500 mb-1.5 font-medium text-left px-1">
                Gợi ý câu hỏi nhanh:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-2.5 py-1 rounded-full transition border border-gray-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Khung nhập tin nhắn */}
          <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập nhu cầu (VD: máy học đồ họa tầm 18tr)..."
                disabled={isLoading}
                className="flex-grow px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-xl transition duration-150 flex items-center justify-center flex-shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
            <div className="text-[10px] text-gray-400 mt-1 text-center">
              AI tư vấn trực tiếp từ dữ liệu kho hàng Laptop Store
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
