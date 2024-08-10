/* eslint-disable react/prop-types */
import { DefaultProduct } from "~/assets/images"
import PriceStartProduct from "~/components/PriceStartProduct"

function ProductCard({product}) {
  return (
    //  dùng flex chia layout
    // trừ đi gap giữa các item (16*2px / 3  )
    <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] my-4 p-2 rounded-md border border-gray-200">
        <div className="flex ">
            <div className="w-[30%]">
                <img src={product.primaryImage?.url || DefaultProduct} alt={product.title} />
            </div>
            <div className="w-[70%] p-2">
                <PriceStartProduct 
                    price={product.price}
                    discountPrice={product.discountPrice}
                    primaryImage={product.primaryImage?.url}
                    title={product.title}
                    slug={product.slug}
                    totalRating={product.totalRating}
                />
            </div>
        </div>
    </div>
  )
}

export default ProductCard