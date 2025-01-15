import { Outlet } from "react-router-dom";
import SideBar from "./Component/SideBar";
function UserProfile() {
  return (
    <div className=" max-md:flex-col  flex overflow-hidden h-screen">
      <div className="max-md:w-full min-w-[calc(15%-6px)] flex-shrink-0 border-r-gray-300 border-r p-2">
        <SideBar />
      </div>
      <div className="max-md:mt-[65px] max-md:w-full w-[calc(85%-6px)] p-2 overflow-x-scroll overflow-y-hidden ">
        <div className="max-md:w-full  min-w-[900px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
