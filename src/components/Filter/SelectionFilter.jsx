/* eslint-disable react/prop-types */
import { memo } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const sortBy = [
    {id:1 ,name:'Bán chạy nhất', value:'-soldQuantity'},
    {id:2 ,name:'Thứ tự,A-Z', value:'title'},
    {id:3 ,name:'Thứ tự,Z-A', value:'-title'},
    {id:4 ,name:'Giá, thấp đến cao', value:'discountPrice'},
    {id:5 ,name:'Giá, cao đến thấp', value:'-discountPrice'},
    {id:6 ,name:'Sản phẩm mới nhất', value:'-createdAt'},
    {id:7 ,name:'Sản phẩm củ', value:'createdAt'},
]
// dunng memo khi nao currentParams thay doi thi moi render lai
function SelectionFilter({currentParams}) {
  const [ ,setSearchParams] = useSearchParams();
  const [firstRender, setFirstRender] = useState(true)
  const [selected, setSelected] = useState(currentParams.sort || '')
  useEffect(() => {
    if (firstRender){
      setFirstRender(false)
      return
    }
    const search ={...currentParams} 
    if(selected){
      search.sort = selected
    }else{
      delete search.sort
    }
    setSearchParams(search)
  },[selected])
  return (
    <select onChange={(e)=> setSelected(e.target.value)} value={selected} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 focus:border-main focus:ring-1 focus:ring-main focus:outline-none hover:border-main hover:shadow-md transition-all duration-300 rounded-lg w-full max-w-xs cursor-pointer h-10">
      <option defaultValue value="">Sắp xếp mặc định</option>
      {sortBy.map((item) => <option key={item.id} value={item.value} >{item.name}</option>)}
    </select>
  )
}

export default memo(SelectionFilter) 