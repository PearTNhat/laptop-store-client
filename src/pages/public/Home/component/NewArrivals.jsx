import { useSelector } from "react-redux"
import CustomSliceProducts from "~/components/CustomSliceProducts"

function NewArrivals() {
  const { newProducts } = useSelector(state => state.products)
  return (
    <div className="">
      <div className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold mb-4">
        New Arrivals
      </div>
      <div className="">
       <CustomSliceProducts products={newProducts} isTrending />
      </div>
    </div>
  )
}

export default NewArrivals