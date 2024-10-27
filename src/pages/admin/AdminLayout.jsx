import { Outlet } from "react-router-dom"
import SideBar from "./Component/SideBar"

function AdminLayout() {
  return (
    <div className="flex gap-3 overflow-hidden h-screen">
        <div className="min-w-[calc(15%-6px)] flex-shrink-0 border-r-gray-300 border-r p-2">
          <SideBar/>
        </div>
        <div className="w-[calc(85%-6px)] p-2 ">
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout