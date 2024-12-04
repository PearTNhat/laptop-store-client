/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { DefaultProduct } from "~/assets/images"
import PriceStartProduct from "~/components/PriceStartProduct"
import path from "~/constants/path"

function ProductCard({product,className}) {
  return (
    //  dùng flex chia layout
    // trừ đi gap giữa các item (16*2px / 3  )
    <div className={"w-full rounded-md border border-gray-200 "+className}>
        <div className="flex ">
            <div className="w-[30%]">
                <Link to={`${path.PUBLIC}${product.slug}`}>
                    <img src={product.primaryImage?.url || DefaultProduct} alt={product.title} />
                </Link>
            </div>
            <div className="w-[70%] p-2">
                <PriceStartProduct 
                    price={product.price}
                    discountPrice={product.discountPrice}
                    primaryImage={product.primaryImage?.url}
                    soldQuantity={product.soldQuantity}
                    title={product.title}
                    slug={product.slug}
                    to={`${path.PUBLIC}${product.slug}`}
                    totalRating={product.totalRating}
                />
            </div>
        </div>
    </div>
  )
}

export default ProductCard