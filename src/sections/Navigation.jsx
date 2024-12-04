import { useMemo, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import InputField from "~/components/InputField";
import { navigation } from "~/constants/navigation";
import { IoIosSearch } from "react-icons/io";
function Navigation() {
  const navigate =useNavigate()
  const [searchParams] = useSearchParams()
  const currentParams =useMemo(()=> Object.fromEntries([...searchParams]),[searchParams]) 
  const [search, setSearch] = useState()
  return (
    <div className="main-container text-[#1d1d1d]">
      <div className="flex items-center justify-between border-y py-2 border-y-gray-300 ">
       <div>
        {navigation.map((item) => (
          <NavLink
            key={item.id}
            className={({ isActive }) => {
              const style = isActive ? "text-main" : "hover:text-main";
              return style + " pr-7";
            }}
            to={item.path}
          >
            {item.name}
          </NavLink>
        ))}
       </div>
        <div className="flex items-center">
            <InputField
            type="text"
            cssDiv="!mb-0"
            placeholder={"Tìm kiếm sản phẩm"}
            nameKey='search'
            clsWrapIcon="left-1"
            icon={<IoIosSearch className="text-xl text-gray-500 "/>}
            className="pl-7 pr-4 py-2 border-gray-300 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
                let value = e.target.value;
                if (value.startsWith(" ")) {
                value = value.trim();
                }
                setSearch(value);
            }}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                  let searchParams =''
                  for (let key in currentParams) {
                      searchParams += `${key}=${currentParams[key]}&`
                  }
                  if(searchParams.endsWith('&')){
                      searchParams = searchParams.slice(0, -1)
                  }
                  if(search){
                    searchParams += `&title=${search}`
                  }
                  navigate(`/laptop/?`+searchParams)
                  
              } 
            }}
            />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
