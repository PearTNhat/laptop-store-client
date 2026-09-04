import { useMemo, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { navigation } from "~/constants/navigation";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { HiHome } from "react-icons/hi2";
import { BsLaptop } from "react-icons/bs";
import path from "~/constants/path";

function Navigation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!search?.trim()) return;
    const params = new URLSearchParams(searchParams);
    params.set("title", search.trim());
    navigate(`/${path.PRODUCTS_CATEGORY}?${params.toString()}`);
  };

  const getNavIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("trang chủ") || lower.includes("home")) {
      return <HiHome className="text-base" />;
    }
    if (lower.includes("laptop")) {
      return <BsLaptop className="text-base" />;
    }
    return null;
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="main-container flex flex-col md:flex-row items-center justify-between py-3 gap-4">
        {/* Navigation Tabs - Distinct Pill Design */}
        <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-xl border border-gray-200/70">
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-lg text-xs md:text-sm uppercase tracking-wider font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-main text-white shadow-sm shadow-red-500/25"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`
              }
            >
              {getNavIcon(item.name)}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block h-6 w-[1px] bg-gray-200 mx-1"></div>

        {/* Search Bar - Distinct Elevated Form */}
        <div className="w-full md:w-[460px]">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center bg-gray-50 hover:bg-gray-100/70 focus-within:bg-white rounded-full border border-gray-200 focus-within:border-main focus-within:ring-2 focus-within:ring-main/15 shadow-sm transition-all duration-200"
          >
            <div className="pl-4 text-gray-400 text-xl flex items-center justify-center">
              <IoIosSearch />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên laptop, cấu hình, hãng..."
              className="w-full py-2.5 pl-3 pr-24 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 font-normal"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 p-1 mr-1 transition-colors"
              >
                <IoClose className="text-base" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-1 px-4 py-1.5 text-xs font-semibold text-white bg-main hover:bg-red-600 rounded-full transition-all duration-200 shadow-sm flex items-center gap-1 active:scale-95"
            >
              <span>Tìm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
