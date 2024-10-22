import { Outlet } from "react-router-dom"
import SideBar from "./Component/SideBar"

function AdminLayout() {
  return (
    <div className="flex gap-3 p-2">
        <div className="w-[calc(25%-6px)]">
          <SideBar/>
        </div>
        <div className="w-[calc(75%-6px)]">
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout