/* eslint-disable react/prop-types */
import { memo } from "react"
import { useEffect, useState } from "react"
import { createSearchParams, useNavigate, useParams } from "react-router-dom"

const sortBy = [
    {id:1 ,name:'Best selling', value:'-soldQuantity'},
    {id:2 ,name:'Alphabetically,A-Z', value:'title'},
    {id:3 ,name:'Alphabetically,Z-A', value:'-title'},
    {id:4 ,name:'Price, low to high', value:'price'},
    {id:5 ,name:'Price, high to low', value:'-price'},
    {id:6 ,name:'Newest', value:'-createdAt'},
    {id:7 ,name:'Oldest', value:'createdAt'},
]
// dunng memo khi nao currentParams thay doi thi moi render lai
function SelectionFilter({currentParams}) {
  const navigate = useNavigate()
  const {category} = useParams()
  const [firstRender, setFirstRender] = useState(true)
  const [selected, setSelected] = useState(currentParams.sort || '')
  useEffect(() => {
    if (firstRender){
      setFirstRender(false)
      return
    }
    const search ={} 
    if (currentParams.colors?.length){
      if( typeof currentParams.colors === 'object'){
        search.colors = currentParams.colors?.join(',')
      }else{
        search.colors = currentParams.colors
      }
    }
    if(currentParams['price[gte]']){
      search['price[gte]'] = currentParams['price[gte]']
    }
    if(currentParams['price[lte]']){
      search['price[lte]'] = currentParams['price[lte]']
    }
    if(selected){
      search.sort = selected
    }
    if(!search) {
      navigate({
        pathname: `/${category}`
      })
    }else{
      navigate({
        pathname: `/${category}`,
        search:createSearchParams({...search}).toString()
      })
    }
  },[selected])
  return (
    <select onChange={(e)=> setSelected(e.target.value)} value={selected} className="d-select d-select-bordered   border border-gray-400 focus:border-gray-400 focus:outline-none  hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[44px] rounded-none w-full max-w-xs">
    <option defaultValue value="">Select sorting</option>
    {sortBy.map((item) => <option key={item.id} value={item.value} >{item.name}</option>)}
    </select>
  )
}

export default memo(SelectionFilter) 