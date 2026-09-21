import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

export default function ChatProductCard({ product }) {
  if (!product) return null;

  const priceFormatted = product.priceVnd
    ? product.priceVnd.toLocaleString("vi-VN") + "đ"
    : "Liên hệ";

  const hasDiscount =
    Boolean(product.originalPriceVnd) &&
    Number(product.originalPriceVnd) > (Number(product.priceVnd) || 0);

  const originalPriceFormatted = hasDiscount
    ? Number(product.originalPriceVnd).toLocaleString("vi-VN") + "đ"
    : null;

  return (
    <div className="group w-full bg-white hover:bg-red-50/40 border border-gray-200/80 hover:border-red-300 rounded-xl p-2.5 transition-all duration-200 shadow-sm hover:shadow text-left flex items-center gap-3">
      {/* Ảnh sản phẩm nhỏ gọn */}
      <div className="relative w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80x80?text=Laptop";
            }}
          />
        ) : (
          <span className="text-gray-400 text-[10px]">No img</span>
        )}
        {product.brand && (
          <span className="absolute top-0.5 left-0.5 bg-blue-600/90 text-white text-[8px] font-bold px-1 rounded uppercase tracking-wider">
            {product.brand}
          </span>
        )}
      </div>

      {/* Thông tin cấu hình tối giản */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-xs font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors"
          title={product.title}
        >
          {product.title}
        </h4>

        {/* Giá bán */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-red-600">
            {priceFormatted}
          </span>
          {hasDiscount ? (
            <span className="text-[10px] text-gray-400 line-through">
              {originalPriceFormatted}
            </span>
          ) : null}
        </div>

        {/* Specs vắn tắt */}
        <div className="flex items-center gap-1 mt-1 overflow-hidden">
          {product.specs?.cpu && (
            <span
              className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[120px]"
              title={product.specs.cpu}
            >
              {product.specs.cpu.split(",")[0]}
            </span>
          )}
          {product.specs?.ram && (
            <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
              {product.specs.ram}
            </span>
          )}
          {product.specs?.hardDrive && (
            <span
              className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]"
              title={product.specs.hardDrive}
            >
              {product.specs.hardDrive}
            </span>
          )}
        </div>
      </div>

      {/* Nút Xem chi tiết gọn gàng */}
      <Link
        to={product.productUrl || `/${product.slug}`}
        className="flex-shrink-0 px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1"
      >
        <span>Xem</span>
        <FaChevronRight className="text-[8px]" />
      </Link>
    </div>
  );
}
