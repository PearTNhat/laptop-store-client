import { Fragment, useState } from "react"
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"
import { useSelector } from "react-redux"
import { Link, NavLink, useLocation } from "react-router-dom"
import { DefaultUser, Logo } from "~/assets/images"
import { userProfilesNavigation } from "~/constants/navigation"

function SideBar() {
  const [activeDropdown, setActiveDropdown] = useState([])
  const {userData} = useSelector(state => state.user)
  const {pathname} = useLocation()
    return (
      <div className="">
        <div className="pb-4 flex flex-col items-center">
          <div className="my-3">
            <Link to='/'>
              <img src={Logo} alt="logo" className="mx-auto" />
            </Link>
          </div>
          <div className="w-[80px] h-[80px] outline outline-1 rounded-full overflow-hidden">
            <img src={userData?.avatar? userData?.avatar?.url : DefaultUser} alt={userData.lastName} className="w-full h-full object-cover"/>
          </div>
          <p className="mt-1">{userData.firstName} {userData.lastName}</p>
        </div>
        <div className="">
          {
            userProfilesNavigation.map((item, index) => 
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
                    className={`${pathname.includes(`/user/`) && 'text-blue-500 ' } flex items-center justify-between gap-2 p-2 hover:bg-gray-200 cursor-pointer`}
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