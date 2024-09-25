import { useEffect, useState } from "react"
import { getAllProducts } from "~/apis/product"
import ProductCard from "./Product/ProductCard"

function Featured() {
  const [products, setProducts] = useState([])
  const fetchFeaturedProducts = async () => {
    const params = {
      limit: 9,
      totalRating: 5,
    }
    const response = await getAllProducts({ params })
    setProducts(response.data)
  }
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])
  return (
    <div>
      <div className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold">
        Featured products
      </div>
      <div className="flex flex-wrap gap-4">
        {
          products.map((product, index) =>
            <ProductCard key={index} product={product} className={'md:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] my-4 p-2'} />
          )
        }
      </div>
      <div className="flex gap-5 mb-4">
        <div className="w-1/2 animation-hover cursor-pointer">
          <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661" className=" object-cover h-full" alt="" />
        </div>
        <div className="w-1/4 flex flex-col gap-5  cursor-pointer">
          <div className="animation-hover flex-1">
            <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661" alt=""  className="w-full"/>
          </div>
          <div className=" animation-hover flex-1">
            <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661" alt=""  className="w-full" />
          </div>
        </div>
        <div className="w-1/4 cursor-pointer  animation-hover ">
          <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661" alt="" className="h-full"/>
        </div>
      </div>
    </div>
  )
}

export default Featured