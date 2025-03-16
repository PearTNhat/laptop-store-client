/* eslint-disable react/prop-types */
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  calculatePercent,
  convertNumberToStar,
  formatNumber,
} from "~/utils/helper";
import { ThunderIcon } from "~/assets/icon";
function PriceStartProduct({
  to,
  price,
  totalRating,
  title,
  discountPrice,
  detailDeals = false,
  soldQuantity,
}) {
  const stars = convertNumberToStar(totalRating);
  let Component = "div";
  if (to) Component = Link;
  return (
    <div className="">
      <Component to={to}>
        <h2
          className="text-[15px] text-black font-medium truncate"
          title={title}
        >
          {title}
        </h2>
        <div className="flex flex-wrap items-center justify-between text-[13px] max-sm:text-[10px] font-medium gap-1">
          <div className="flex items-center ">
            {/* Giá chưa giảm */}
            {price !== 0 && (
              <>
                <p className="line-through text-[#6b7280] ">
                  {formatNumber(price)}₫
                </p>
                {/* % */}
                <p
                  className={`ml-1 text-main ${
                    detailDeals &&
                    "bg-[#FDE68A] relative pl-2 pr-1 rounded-r-md h-[18px]"
                  }`}
                >
                  {detailDeals && (
                    <ThunderIcon className={"absolute left-[-2px]"} />
                  )}{" "}
                  -{calculatePercent(price, discountPrice)}%
                </p>
              </>
            )}
          </div>
          <p>{soldQuantity} đã bán</p>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          {/* Giá đã giảm */}
          <p className="text-[16px] max-sm:text-xs font-semibold text-black">
            {formatNumber(discountPrice)} ₫
          </p>
          <div className="flex text-yellow-300 text-[13px]">
            {stars.map((star, index) => {
              return <span key={index}>{star}</span>;
            })}
          </div>
        </div>
      </Component>
    </div>
  );
}

export default memo(PriceStartProduct);
