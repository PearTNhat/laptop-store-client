/* eslint-disable react/prop-types */
import { FaRegStar, FaStar } from 'react-icons/fa'
import { memo } from 'react'
import { FaRegStarHalfStroke } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { calculatePercent, convertNumberToStar, formatNumber } from '~/utils/helper'
import { ThunderIcon } from '~/assets/icon';
function PriceStartProduct({ to, price,totalRating, discountPrice, title, daillDeals=false }) {
    const stars = convertNumberToStar(totalRating)
    return (
        <div className="">
            <Link to={to}>
                <p className="text-[15px] text-black font-medium truncate" title={title}>{title}</p>
                <div className="flex items-center text-[13px] font-medium gap-1">
                    {/* Giá chưa giảm */}
                    <p className="line-through text-[#6b7280] ">{formatNumber(price)} ₫</p>
                    {/* % */}
                    <p className={`ml-1 text-main ${daillDeals && 'bg-[#FDE68A] relative pl-2 pr-1 rounded-r-md h-[18px]'}`}>
                        {daillDeals && <ThunderIcon className={'absolute left-[-2px]'} />}
                        -{calculatePercent(price, discountPrice)}%
                    </p>
                </div>
              
                <div className="flex items-center justify-between">
                    {/* Giá đã giảm */}
                    <p className="text-[16px] font-semibold text-black">{formatNumber(discountPrice)} ₫</p>
                    <div className="flex text-yellow-300 text-[13px]">
                        {stars.map((star, index) => {
                            if (star === 1) {
                                return <FaStar key={index} className="" />
                            } else if (star === 0.5) {
                                return <FaRegStarHalfStroke key={index} className=" " />
                            } else {
                                return <FaRegStar key={index} className="" />
                            }
                        })
                        }
                    </div>
                </div>
            </Link>
          
        </div>
    )
}

export default memo(PriceStartProduct)