import { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DefaultUser, Logo } from "~/assets/images";
import { userProfilesNavigation } from "~/constants/navigation";
import path from "~/constants/path";
import useWindowSizeCustom from "~/hook/useWindowSizeCustom";
import { userActions } from "~/store/slice/userSlice";

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { width } = useWindowSizeCustom();

  useEffect(() => {
    if (width > 768) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }, [width]);

  const handleLogout = () => {
    Swal.fire({
      title: "Đăng xuất tài khoản?",
      text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ee3131",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Ở lại",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(userActions.logout());
        navigate(`/${path.HOME}`);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="block">
          <img src={Logo} alt="Digital World" className="h-8 w-auto object-contain" />
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Navigation & Profile */}
      <div
        className={`${
          isMenuOpen ? "flex flex-col flex-1 overflow-y-auto" : "hidden md:flex md:flex-col md:flex-1 md:overflow-y-auto"
        } p-4 space-y-6`}
      >
        {/* User Card Widget */}
        <div className="bg-gradient-to-b from-gray-50 to-slate-50/80 rounded-2xl p-4 border border-gray-100/80 flex flex-col items-center text-center">
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-main via-rose-400 to-amber-400 shadow-sm mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
              <img
                src={userData?.avatar?.url || DefaultUser}
                alt={userData?.lastName || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DefaultUser;
                }}
              />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug">
            {userData?.firstName} {userData?.lastName}
          </h3>
          <p className="text-[11px] text-gray-500 truncate max-w-[190px] mt-0.5">
            {userData?.email}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 bg-red-50 text-main text-[11px] font-semibold rounded-full border border-red-100/60">
            {userData?.role === "admin" ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1.5 flex-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Tài khoản của tôi
          </div>
          {userProfilesNavigation.map((item, index) => {
            const showDropdown = activeDropdown.includes(item.id);
            return (
              <Fragment key={item.id}>
                {item.type === "SINGLE" && (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                        isActive
                          ? "bg-gradient-to-r from-red-50 to-rose-50 text-main font-bold border-l-4 border-main shadow-xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/90 font-medium"
                      }`
                    }
                    onClick={() => {
                      if (width <= 768) setIsMenuOpen(false);
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`text-lg transition-transform duration-150 group-hover:scale-110 ${
                            isActive ? "text-main" : "text-gray-400 group-hover:text-gray-700"
                          }`}
                        />
                        <span>{item.text}</span>
                      </>
                    )}
                  </NavLink>
                )}
                {item.type === "PARENT" && (
                  <div key={index} className="space-y-1">
                    <button
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        pathname.includes("/user/")
                          ? "text-main bg-red-50/50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (showDropdown) {
                          setActiveDropdown((prev) => prev.filter((x) => x !== item.id));
                        } else {
                          setActiveDropdown((prev) => [...prev, item.id]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="text-lg text-gray-400" />
                        <span>{item.text}</span>
                      </div>
                      <div className="text-lg text-gray-400">
                        {showDropdown ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                      </div>
                    </button>
                    {showDropdown && (
                      <div className="pl-6 space-y-1">
                        {item.submenus.map((subitem, sIndex) => (
                          <NavLink
                            key={sIndex}
                            to={subitem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                isActive
                                  ? "text-main font-bold bg-red-50"
                                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                              }`
                            }
                          >
                            {subitem.text}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-main hover:bg-red-50/50 rounded-xl transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            <span>Về trang mua sắm</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
          >
            <FiLogOut className="text-sm" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
