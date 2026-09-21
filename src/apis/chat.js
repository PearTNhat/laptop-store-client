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
        timeout: 35000 // Timeout 35s cho lượt xử lý AI + Tools
      }
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: {
        code: 500,
        message: "Không thể kết nối đến máy chủ AI, vui lòng thử lại sau.",
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
