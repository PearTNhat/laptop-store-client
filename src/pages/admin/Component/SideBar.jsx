import { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "~/assets/images";
import { adminNavigation } from "~/constants/navigation";
import path from "~/constants/path";
import useWindowSizeCustom from "~/hook/useWindowSizeCustom";
import { IoMenu ,IoClose} from "react-icons/io5";

function SideBar() {
  const [activeDropdown, setActiveDropdown] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { width } = useWindowSizeCustom();
  const toggleMenuHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    if (width > 768) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }, [width]);
  const handleClickItemDropDown = () => {
    setIsMenuOpen(false);
  };
  return (
    <div className="max-md:fixed max-md:w-full z-[999] bg-white p-2 ">
      <div className="pb-4">
        <div className="flex justify-between items-center px-2">
          <Link to="/">
            <img src={Logo} alt="logo" className="mx-auto" />
          </Link>
          <div className="md:hidden">
            {isMenuOpen ? (
              <IoClose
                onClick={toggleMenuHandler}
                className="cursor-pointer text-2xl"
              />
            ) : (
              <IoMenu
                onClick={toggleMenuHandler}
                className="cursor-pointer text-2xl"
              />
            )}
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? "block max-md:animate-drop-down-animation" : "hidden"}`}>
        {adminNavigation.map((item, index) => {
          let showDropdown = activeDropdown.some((x) => x === item.id); // kiem tra xem item.id co trong activeDropdown khong
          return (
            <Fragment key={item.id}>
              {item.type === "SINGLE" && (
                <NavLink
                  to={item.path}
                  className={() => {
                    const isActive = pathname === item.path;
                    return `${
                      isActive && "text-blue-500 "
                    } flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer`;
                  }}
                  onClick={()=> handleClickItemDropDown()}
                >
                  <item.icon />
                  <p>{item.text}</p>
                </NavLink>
              )}
              {item.type === "PARENT" && (
                <div key={index} className="">
                  <div
                    className={`${
                      pathname.includes(`${path.ADMIN}/manage/products`) &&
                      "text-blue-500 "
                    } flex items-center justify-between gap-2 p-2 hover:bg-gray-200 cursor-pointer`}
                    onClick={() => {
                      // toggle dropdown
                      if (showDropdown) {
                        setActiveDropdown((prev) =>
                          prev.filter((x) => x !== item.id)
                        );
                        return;
                      }
                      setActiveDropdown((prev) => [...prev, item.id]);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <p>{item.text}</p>
                    </div>
                    <div className="text-xl">
                      {showDropdown ? (
                        <IoMdArrowDropdown />
                      ) : (
                        <IoMdArrowDropup />
                      )}
                    </div>
                  </div>
                  {showDropdown && (
                    <div className="pl-4 select-none">
                      {item.submenus.map((subitem, index) => (
                        <NavLink
                          key={index}
                          to={subitem.path}
                          className={() => {
                            const activePath = pathname === subitem.path;
                            return `${
                              activePath && "text-blue-500"
                            } flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer`;
                          }}
                          onClick={()=> handleClickItemDropDown()}
                        >
                          <p>{subitem.text}</p>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
