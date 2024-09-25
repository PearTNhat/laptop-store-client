/* eslint-disable react/prop-types */
import path from "~/constants/path";
import { Link } from "react-router-dom"
import { FaHeart, } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { DefaultProduct, NewLabel, TrendingLabel } from "~/assets/images"
import SelectOption from "~/components/SelectOption"
import PriceStartProduct from "~/components/PriceStartProduct";
function Product({className,soldQuantity, price, discountPrice, primaryImage, title, category,slug, totalRating, isNew, isTrending }) {
    let label = {}
    if (isNew) {
        label.img = NewLabel
        label.text = 'New'
    }
    if (isTrending) {
        label.img = TrendingLabel
        label.text = 'Trending'
    }
    return (
        <div className={"rounded-md border border-gray-300  cursor-pointer group "+className}>
            <div className="mb-3 relative ">
                <Link to={`${path.PUBLIC}${category?.toLowerCase()}/${slug}`}>
                    <img src={primaryImage || DefaultProduct} alt={title} />
                    <img src={label.img} alt={label.text} className="absolute w-[67px] right-[-12px] top-[-3px]" />
                </Link>
                <div className="hidden  group-hover:flex justify-center items-center gap-2 w-full group-hover:animate-slide-top absolute">
                    <SelectOption Icon={FaHeart} to />
                    <SelectOption Icon={IoMenu} to={`${category.toLowerCase()}/${slug}`} />
                    <SelectOption Icon={IoEyeSharp} to />
                </div>
            </div>
            <PriceStartProduct
                to={`${path.PUBLIC}${category?.toLowerCase()}/${slug}`}
                totalRating={totalRating}
                price={price}
                discountPrice={discountPrice}
                title={title}
                soldQuantity={soldQuantity}
            />
        </div>
    )
}

export default Product