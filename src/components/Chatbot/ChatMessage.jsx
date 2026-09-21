import React, { useEffect, useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatProductCard from "./ChatProductCard";

export default function ChatMessage({ message = {}, isTyping }) {
  const [typingStage, setTypingStage] = useState(0);

  // Hiệu ứng tiến trình động khi đang chờ AI gọi Tool (0-2s, 2-4s, 4s+)
  useEffect(() => {
    if (!isTyping) return;
    setTypingStage(0);

    const timer1 = setTimeout(() => setTypingStage(1), 2000);
    const timer2 = setTimeout(() => setTypingStage(2), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTyping]);

  const typingMessages = [
    "Đang lắng nghe câu hỏi của bạn...",
    "Đang kiểm tra kho hàng và thông số cấu hình...",
    "Đang tổng hợp các dòng máy phù hợp nhất..."
  ];

  if (isTyping) {
    return (
      <div className="flex gap-2.5 items-start mb-4">
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <FaRobot className="text-sm" />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-500 italic">
              {typingMessages[typingStage]}
            </span>
          </div>
          <div className="flex gap-1 items-center py-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!message || !message.content) {
    return null;
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 items-start mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {isUser ? <FaUser className="text-xs" /> : <FaRobot className="text-sm" />}
      </div>

      {/* Bong bóng tin nhắn */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {isUser ? (
          <div className="p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line bg-blue-600 text-white rounded-tr-none text-left">
            {message.content}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-white border border-gray-100 text-gray-800 rounded-tl-none text-left">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                h3: ({ children }) => <h3 className="font-bold text-gray-900 text-base mt-3 mb-1.5">{children}</h3>,
                h4: ({ children }) => <h4 className="font-bold text-gray-900 text-sm mt-2 mb-1">{children}</h4>,
                hr: () => <hr className="my-2.5 border-gray-200" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full text-xs border border-gray-200 divide-y divide-gray-200">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-2.5 py-1.5 bg-gray-100 font-semibold text-gray-700 text-left border-r border-gray-200 last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-2.5 py-1.5 border-t border-r border-gray-200 last:border-r-0">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {children}
                  </a>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Danh sách Card sản phẩm nếu có */}
        {message.products && message.products.length > 0 && (
          <div className="w-full mt-2.5">
            <div className="text-[11px] font-semibold text-gray-500 mb-1.5 text-left flex items-center gap-1.5">
              <span>Gợi ý sản phẩm phù hợp ({message.products.length} máy):</span>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {message.products.map((p) => (
                <ChatProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Thời gian */}
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit"
              })
            : ""}
        </span>
      </div>
    </div>
  );
}
