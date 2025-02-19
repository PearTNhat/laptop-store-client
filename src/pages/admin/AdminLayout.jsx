import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./Component/SideBar";
import {  useSelector } from "react-redux";
import { useEffect } from "react";

function AdminLayout() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (userData.role !== "admin") {
      navigate("/");
    }
  }, []);
  return (
    <div className=" max-md:flex-col flex overflow-hidden h-screen">
      <div className="max-md:w-full min-w-[calc(15%-6px)] flex-shrink-0 border-r-gray-300 border-r ">
        <SideBar />
      </div>
      <div className="max-md:mt-[65px] max-md:w-full w-[calc(85%-6px)] bg-[rgb(248,248,252)] p-2 overflow-x-auto overflow-y-hidden">
        <div className="max-md:w-full min-w-[1000px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
