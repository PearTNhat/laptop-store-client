import { Outlet } from "react-router-dom"
import  SideBar  from "./Component/SideBar"
function UserProfile() {
  return (
    <div className="flex overflow-hidden h-screen">
        <div className="min-w-[calc(15%-6px)] flex-shrink-0 border-r-gray-300 border-r p-2">
          <SideBar/>
        </div>
        <div className="w-[calc(85%-6px)] ">
            <Outlet />
        </div>
    </div>
  )
}

export default UserProfile