import { http } from "~/utils/http";

/**
 * Gửi tin nhắn tới Chatbot AI
 */
export const apiSendChatMessage = async ({ message, conversationId, guestId }) => {
  try {
    const headers = {};
    if (conversationId) headers["x-conversation-id"] = conversationId;
    if (guestId) headers["x-guest-id"] = guestId;

    const { data } = await http.post(
      "chat",
      { message, conversationId },
      {
        headers,
        withCredentials: true,
        timeout: 75000 // Tăng timeout lên 75s cho các lượt suy luận Gemini + gọi Tool tra cứu DB
      }
    );
    return data;
  } catch (error) {
    console.error("[Chat API Error]:", error);
    if (error.response && error.response.data) {
      console.error("[Chat API Response Data]:", error.response.data);
      return error.response.data;
    }
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
    return {
      success: false,
      error: {
        code: error.code || 500,
        message: isTimeout
          ? "Hệ thống AI xử lý quá 75s (Timeout). Máy chủ AI Google có thể đang bị nghẽn mạng, bạn vui lòng thử lại nhé!"
          : `Không thể kết nối đến máy chủ AI (${error.message || "Lỗi mạng"}), vui lòng thử lại sau.`,
        detail: error.message,
        retryable: true
      }
    };
  }
};

/**
 * Lấy lịch sử tin nhắn của cuộc hội thoại
 */
export const apiGetChatHistory = async (conversationId) => {
  try {
    if (!conversationId) return null;
    const { data } = await http.get(`chat/history/${conversationId}`, {
      withCredentials: true
    });
    return data;
  } catch (error) {
    return null;
  }
};
