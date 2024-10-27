import { Fragment, useState } from "react"
import { IoMdArrowDropup,IoMdArrowDropdown  } from "react-icons/io";
import { Link, NavLink, useLocation } from "react-router-dom"
import { Logo } from "~/assets/images"
import { adminNavigation } from "~/constants/navigation"
import path from "~/constants/path";

function SideBar() {
  const [activeDropdown, setActiveDropdown] = useState([])
  const {pathname} = useLocation()
  return (
    <div className="">
      <div className="pb-4">
        <Link to='/'>
          <img src={Logo} alt="logo" className="mx-auto" />
        </Link>
        <p className="text-center">Admin workspace</p>
      </div>
      <div className="">
        {
          adminNavigation.map((item, index) => 
            { let showDropdown = activeDropdown.some(x => x === item.id) // kiem tra xem item.id co trong activeDropdown khong
            return <Fragment key={item.id}>
            {  item.type === 'SINGLE'  && (
                <NavLink to={item.path} className={({isActive})=>{
                  return `${isActive && 'text-blue-500 '} flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer`
                }}>
                  <item.icon />
                  <p>{item.text}</p>
                </NavLink>
              )
            }
            {
              item.type === 'PARENT' && (
                <div key={index} className="">
                  <div 
                  className={`${pathname.includes(`${path.ADMIN}/manage/products`) && 'text-blue-500 ' } flex items-center justify-between gap-2 p-2 hover:bg-gray-200 cursor-pointer`}
                  onClick={() => { // toggle dropdown
                    if(showDropdown) {
                      setActiveDropdown((prev)=>prev.filter(x => x !== item.id))
                      return
                    }
                    setActiveDropdown((prev)=>[...prev, item.id])
                  }}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <p>{item.text}</p>
                    </div>
                    <div className="text-xl">
                      {showDropdown ?  <IoMdArrowDropdown /> : <IoMdArrowDropup/>}
                    </div>
                  </div>
                  {
                   showDropdown  &&
                    <div className="pl-4 select-none">
                      {
                        item.submenus.map((subitem, index) => 
                          <NavLink key={index} to={subitem.path} className={()=>{
                            const activePath =pathname === subitem.path
                            return `${activePath && 'text-blue-500'} flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer`
                          }}>
                            <p>{subitem.text}</p>
                          </NavLink>
                        )
                      }
                    </div>
                  }
                </div>
              )
            }
            </Fragment>
            }
        )
      }
      </div>
    </div>
  )
}

export default SideBar