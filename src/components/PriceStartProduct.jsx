/* eslint-disable react/prop-types */
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  calculatePercent,
  convertNumberToStar,
  formatNumber,
} from "~/utils/helper";

function PriceStartProduct({
  to,
  price,
  totalRating,
  title,
  discountPrice,
  soldQuantity,
}) {
  const stars = convertNumberToStar(totalRating);
  let Component = "div";
  if (to) Component = Link;
  const hasDiscount = Boolean(
    Number(price) > 0 &&
    Number(discountPrice) > 0 &&
    Number(price) > Number(discountPrice)
  );
  const percent = hasDiscount ? calculatePercent(price, discountPrice) : 0;

  return (
    <div className="pt-1">
      <Component to={to} className="block group/link">
        <h2
          className="text-sm font-semibold text-gray-800 group-hover/link:text-main truncate transition-colors"
          title={title}
        >
          {title}
        </h2>

        {/* Rating and Sold */}
        <div className="flex items-center justify-between text-xs mt-1.5 gap-1">
          <div className="flex text-amber-400 text-[11px] items-center gap-0.5 flex-shrink-0">
            {stars.map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>
          <span className="text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 whitespace-nowrap">
            Đã bán: <strong className="text-gray-700">{soldQuantity || 0}</strong>
          </span>
        </div>

        {/* Prices Section - Clean, High-Contrast, Never Line-Break Currency */}
        <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base sm:text-[17px] font-bold text-red-600 whitespace-nowrap">
            {formatNumber(discountPrice || price)}₫
          </span>
          {hasDiscount && (
            <span className="line-through text-xs text-gray-400 whitespace-nowrap">
              {formatNumber(price)}₫
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-1 py-0.2 rounded whitespace-nowrap">
              -{percent}%
            </span>
          )}
        </div>
      </Component>
    </div>
  );
}

export default memo(PriceStartProduct);
