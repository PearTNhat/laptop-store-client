import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import path from "~/constants/path"

function SideBar() {
  const { brands } = useSelector((state) => state.brand);

  return (
    <div className='w-full lg:w-[25%] flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      {
        brands?.map((brand, idx) => {
          const brandValue = brand?.label?.toLowerCase();
          return (
            <NavLink 
              key={idx} 
              className={({ isActive }) => {
                // Chúng ta không dùng isActive của NavLink vì query param mới quyết định, nhưng cứ để class hover cơ bản
                return 'text-gray-700 hover:bg-gray-50 hover:text-main px-5 py-3 flex items-center transition-all duration-300 last:rounded-b-lg border-b last:border-none border-gray-100'
              }} 
              to={`${path.PUBLIC}${path.PRODUCTS_CATEGORY}?brands=${brandValue}`}
            >
              <span className="block font-medium">{brand.label}</span>
            </NavLink>
          )
        })
      }
    </div>
  )
}

export default SideBar