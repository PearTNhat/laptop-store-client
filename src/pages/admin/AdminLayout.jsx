import { Outlet } from "react-router-dom"
import SideBar from "./Component/SideBar"

function AdminLayout() {
  return (
    <div className="flex overflow-hidden h-screen">
        <div className="min-w-[calc(15%-6px)] flex-shrink-0 border-r-gray-300 border-r p-2 pr-4">
          <SideBar/>
        </div>
        <div className="w-[calc(85%-6px)] bg-[rgb(248,248,252)] p-2">
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout