import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "~/apis/product"
import CustomSliceProducts from "~/components/CustomSliceProducts"
import { fetchNewProduct } from "~/store/action/product"

const tabs = [
  {
    id: 1,
    name: "Best seller"
  },
  {
    id: 2,
    name: "New Arrival"
  }

]
function ListProduct() {
  const  dispatch = useDispatch()
  const {newProducts} = useSelector(state => {return state.products})
  const [isActiveTab, setIsActiveTab] = useState(1)
  const [bestSeller, setBestSeller] = useState([])
  const fetchProduct = async () => {
    const response = await getAllProducts({ params: { sort: '-soldQuantity' } })
    if (response?.success) setBestSeller(response.data)
  }
  useEffect(() => {
    fetchProduct()
    dispatch(fetchNewProduct())
  }, []);
  return (
    <div className="ml-3 flex-1 overflow-hidden">
      <ul className="flex gap-3 mb-3 border-b-2 border-b-main flex-1 py-3 basis-full">
        {
          tabs.map((tab) =>
            <li
              key={tab.id}
              className={`uppercase text-xl font-semibold cursor-pointer ${isActiveTab == tab.id ? 'text-bl' : 'opacity-50'}`}
              onClick={() => setIsActiveTab(tab.id)}
            >{tab.name}</li>
          )
        }
      </ul>
      <div className="">
        {isActiveTab === 1 ?
          <CustomSliceProducts products= {bestSeller} isTrending/>
          :
          <CustomSliceProducts products= {newProducts} isNew/>
        }
      </div>
    </div>
  )
}

export default ListProduct