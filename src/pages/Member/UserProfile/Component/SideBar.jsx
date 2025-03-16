import { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { DefaultUser, Logo } from "~/assets/images";
import { userProfilesNavigation } from "~/constants/navigation";
import useWindowSizeCustom from "~/hook/useWindowSizeCustom";

function SideBar() {
  const [activeDropdown, setActiveDropdown] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleMenuHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const { width } = useWindowSizeCustom();
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
    <div className="max-md:fixed max-md:w-full z-[999999] bg-white">
      <div className="p-4">
        <div className="flex justify-between px-2">
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
      <div className={`${isMenuOpen ? "max-md:flex max-md:flex-col max-md:animate-drop-down-animation" : "hidden"}  max-md:items-center gap-2 p-2`}>
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-[80px] h-[80px] outline outline-1 rounded-full overflow-hidden">
            <img
              src={userData?.avatar ? userData?.avatar?.url : DefaultUser}
              alt={userData.lastName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-1">
            {userData.firstName} {userData.lastName}
          </p>
        </div>
        {userProfilesNavigation.map((item, index) => {
          let showDropdown = activeDropdown.some((x) => x === item.id); // kiem tra xem item.id co trong activeDropdown khong
          return (
            <Fragment key={item.id}>
              {item.type === "SINGLE" && (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => {
                    return `${
                      isActive && "text-blue-500 "
                    } max-md:w-[200px] flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer`;
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
                      pathname.includes(`/user/`) && "text-blue-500 "
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
