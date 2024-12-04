/* eslint-disable react/prop-types */
import { memo } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const sortBy = [
    {id:1 ,name:'Bán chạy nhất', value:'-soldQuantity'},
    {id:2 ,name:'Thứ tự,A-Z', value:'title'},
    {id:3 ,name:'Thứ tự,Z-A', value:'-title'},
    {id:4 ,name:'Giá, thấp đến cao', value:'price'},
    {id:5 ,name:'Giá, cao đến thấp', value:'-price'},
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
    <select onChange={(e)=> setSelected(e.target.value)} value={selected} className="p-2  border border-gray-400 focus:border-gray-400 focus:outline-none  hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[44px] rounded-none max-w-xs">
    <option defaultValue value="">Lựa chọn</option>
    {sortBy.map((item) => <option key={item.id} value={item.value} >{item.name}</option>)}
    </select>
  )
}

export default memo(SelectionFilter) 