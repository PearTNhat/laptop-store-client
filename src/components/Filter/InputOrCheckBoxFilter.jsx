/* eslint-disable react/prop-types */
import { useEffect, useRef, useState,memo, useMemo } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate,createSearchParams, useParams, useSearchParams} from "react-router-dom";
import InputField from "~/components/InputField";
import { covertMoneyToNumber, formatNumber } from "~/utils/helper";
import { useDebounce } from "~/hook/useDebounce";
import { getAllProducts } from "~/apis/product";
// let firstRender = true
function InputOrCheckBoxFilter({ name,data, type = 'checkbox' }) {
  const ref = useRef();
  const {category} = useParams()
  const navigate =useNavigate()
  const [activeFilter, setActiveFilter] = useState('')
  const [hightestPrice, setHightestPrice] = useState(0)
  const [firstRender, setFirstRender] = useState(true)
  const [searchParams] = useSearchParams()
  const currentParams =useMemo(()=> Object.fromEntries([...searchParams]),[searchParams])
  const [filterPrice, setFilterPrice] = useState({
    'price[gte]': currentParams['price[gte]'] || '0',
    'price[lte]': currentParams['price[lte]'] || '0'
  })
  // cái giá trị mặc định chỉ lấy khi lần mount đầu tiên
  const [filter, setFilter] = useState({
    colors:currentParams.colors?.split(',') || [],
    'price[gte]': currentParams['price[gte]'] || '0',
    'price[lte]': currentParams['price[lte]'] || '0'
  })
  
  const priceDebouncing =useDebounce(filterPrice,1000)
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setActiveFilter(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // lấy giá cao nhất
  useEffect(() => {
    const fetchHighestPrice = async () => {
      const response = await getAllProducts({params: {category,sort:'-price',limit:1}})
      if(response.success){
        setHightestPrice(response.data[0].price)
      }
    }
    fetchHighestPrice()  
  }, [])
  // sử lý debouncing cho giá
  useEffect(() => {
    setFilter(prev=>({...prev, ...priceDebouncing}))
  }, [priceDebouncing])
  // mỗi khi searchParams thay đổi thì set lại filter
  useEffect(() => {
    setFilter({
      colors:currentParams.colors?.split(',') || [],
      'price[gte]': currentParams['price[gte]'] || 0,
      'price[lte]': currentParams['price[lte]'] || 0
    })
  },[currentParams])
  // sử lý filter nhiều thứ
  useEffect(() => {
    if(name !== activeFilter) return 
    if (firstRender){
      setFirstRender(false)
      return
    }
    const search ={} 
    if (filter.colors?.length){
      search.colors = filter.colors.join(',')
    }
    if(filter['price[gte]']){
      search['price[gte]'] = filter['price[gte]']
    }
    if(filter['price[lte]']){
      search['price[lte]'] = filter['price[lte]']
    }
    if(currentParams.sort){
      search.sort = currentParams.sort
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
  // cần dependency activeFilter để chọn vào cái nào thì search ngay cái đó
  },[filter,activeFilter])
  return (
    <div ref={ref} className="relative bg-white border border-gray-400 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]" onClick={() =>{
      if(activeFilter === name){
        setActiveFilter(null)
      } else{
        setActiveFilter(name)
      }
      }}>
      <div className="flex items-center p-3 cursor-pointer">
        <span className="capitalize text-sm">{name}</span>
        <RiArrowDropDownLine className="text-xl"/>
      </div>
      {
        type === 'checkbox' &&
        <div className={`${activeFilter === name ? 'block': 'hidden'} absolute z-10  rounded-md  bg-white border border-gray-300 top-[calc(100%+4px)]`} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center px-[16px] py-3 border border-b-gray-400 text-sm">
            <div className="">
              <span>Selected: </span>
              <span>{filter.colors.length}</span>
            </div>
            <button className="cursor-pointer hover:text-main" onClick={()=> setFilter({...filter,colors:[]})} >Reset</button>
          </div>
          {
            data.map((item) =>
              <div key={item} className="px-[16px] py-[5px] flex items-center gap-2 whitespace-nowrap">
                <input type="checkbox" id={item} checked={filter.colors.includes(item)} className="w-[20px] h-[20px] rounded-sm d-checkbox d-checkbox-info" onChange={(e)=>{
                    if(e.target.checked){
                      setFilter({...filter,colors: [...filter.colors, item]})
                    }else{
                      setFilter({...filter,colors: filter.colors.filter((color) => color !== item)})  
                    }
                  }} />
                <label className="cursor-pointer capitalize" htmlFor={item}>
                  {item}
                </label>
              </div>
            )
          }
        </div>
      }
      {
        type === 'input' && (
          <div className={`${activeFilter === name ? 'block': 'hidden'} w-[348px] absolute z-10  rounded-md overflow-hidden bg-white border border-gray-300 left-[-1px] top-[calc(100%+4px)]`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-[16px] py-3 border border-b-gray-400 text-sm">
              <p>The hightest price is {formatNumber(hightestPrice)}</p>
              <button className="cursor-pointer hover:text-main" onClick={()=> setFilter({...filter, 'price[gte]': '','price[lte]': ''})} >Reset</button>
            </div>
            <div className="flex gap-3 pt-[16px]  px-[16px]">
              <InputField
              placeholder={"From"}
              value={formatNumber(Number(filterPrice['price[gte]'])) || 0 }
              nameKey={'price[gte]'}
              onChange={(e)=> setFilterPrice({...filterPrice, 'price[gte]': covertMoneyToNumber(e.target.value) })}
              />
               <InputField
              placeholder={"To"}
              value={formatNumber(Number(filter['price[lte]']))|| ''}
              nameKey={'price[lte]'}
              onChange={(e)=> setFilter({...filterPrice, 'price[lte]': covertMoneyToNumber(e.target.value) })}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default memo(InputOrCheckBoxFilter)