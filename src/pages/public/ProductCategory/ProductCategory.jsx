import { useEffect, useMemo, useState } from "react"
import {  useParams, useSearchParams } from "react-router-dom"
import { getAllProducts } from "~/apis/product"
import Breadcrumbs from "~/components/Breadcrumbs"
import Product from "../Home/component/Product/Product"
import InputOrCheckBoxFilter from "~/components/Filter/InputOrCheckBoxFilter"
import SelectionFilter from "~/components/Filter/SelectionFilter"
const colors = ['Titan Đen', 'Titan Trắng', 'Titan Xanh', 'Titan tự nhiên']
function ProductCategory() {
  const {category} = useParams()
  const [products, setProducts] = useState([])
  const [searchParams] = useSearchParams()
  const currentParams =useMemo(()=> Object.fromEntries([...searchParams]),[searchParams]) 
  const fetchProductCategory = async (filter) => {
      const response = await getAllProducts({params: {...filter,category}})
      if(response.success) {
        setProducts(response.data)
      }
  }    
  useEffect(() => {  
    fetchProductCategory(currentParams)
  },[currentParams])
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  return (
    <div className="my-8">
      <div className="bg-[#f7f7f7]">
        <div className="py-2 mb-8 main-container">
          <Breadcrumbs />
          <h3 className="uppercase text-xl font-semibold text-black">{category}</h3>
        </div>
      </div>
      <div className="main-container">
        <div className="flex justify-between items-center">
          <div className="">
            <p className="font-semibold">Filter by</p>
            <div className="flex gap-2 my-4">
              <InputOrCheckBoxFilter  name="price" type="input"/>
              <InputOrCheckBoxFilter  name="color" data={colors} />
            </div>
          </div>
          <div className="">
            <p className="font-semibold">Sort by</p>
            <div className="w-[200px] my-4">
              <SelectionFilter currentParams={currentParams} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
            {
              products.map((product)=> 
                <Product
                key={product._id}
                price={product.price}
                discountPrice={product.discountPrice}
                primaryImage={product.primaryImage.url}
                title={product.title}
                category={product.category?.title}
                slug={product.slug}
                totalRating={product.totalRating}
                soldQuantity={product.soldQuantity}
                className="p-3 w-[calc(25%-9px)] max-md:w-[calc(50%-6px)] max-lg:w-[calc(33.3333%-8px)]"
                />
              )
            }
        </div>
      </div>
    </div>
  )
}

export default ProductCategory