import { DefaultUser, Logo } from "~/assets/images";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import path from "~/constants/path";
import { useDispatch, useSelector } from "react-redux";
import { userDropdown } from "~/constants/dropdown";
import Button from "~/components/Button";
import { userActions } from "~/store/slice/userSlice";
import { Toast } from "~/utils/alert";
import { fetchBrands } from "~/store/action/brand";
import Cart from "~/components/MyCart/Cart";
import { useEffect } from "react";
function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userActions.logout());
    Toast.fire({
      icon: "success",
      title: "Đăng xuất thành công",
    });
  };

  useEffect(() => {
    dispatch(fetchBrands());
  }, []);

  return (
    <div className="bg-white border-b border-gray-100/90 sticky top-0 z-40 shadow-xs">
      <div className="main-container py-3 sm:py-3.5">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={`/${path.HOME}`} className="block transition-transform duration-200 hover:opacity-95">
              <img
                src={Logo}
                alt="Laptop Store"
                className="h-6 sm:h-[26px] max-w-[170px] sm:max-w-[190px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Contact Info Badges (Hidden on mobile/tablet) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {/* Phone Hotline Pill */}
            <a
              href="tel:0944477357"
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-gray-50/90 hover:bg-red-50/70 border border-gray-100 hover:border-red-100/80 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-red-100/70 text-main group-hover:bg-main group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <FaPhoneAlt className="text-xs" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Hotline (9h - 18h)
                </span>
                <span className="text-[13px] font-extrabold text-gray-800 group-hover:text-main transition-colors leading-tight">
                  0944 477 357
                </span>
              </div>
            </a>

            {/* Email Support Pill */}
            <a
              href="mailto:letuannhat105@gmail.com"
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-gray-50/90 hover:bg-red-50/70 border border-gray-100 hover:border-red-100/80 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-red-100/70 text-main group-hover:bg-main group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <MdEmail className="text-sm" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Hỗ trợ trực tuyến 24/7
                </span>
                <span className="text-[13px] font-extrabold text-gray-800 group-hover:text-main transition-colors leading-tight">
                  letuannhat105@gmail.com
                </span>
              </div>
            </a>
          </div>

          {/* Right Action Icons (Wishlist, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            {user.accessToken && (
              <Link
                to={path.USER_WISHLIST}
                title="Danh sách yêu thích"
                className="w-10 h-10 rounded-xl bg-gray-50/90 hover:bg-red-50 hover:text-main text-gray-600 border border-gray-100 hover:border-red-100 flex items-center justify-center transition-all duration-200 shadow-2xs group"
              >
                <FaRegHeart className="text-base transition-transform group-hover:scale-110" />
              </Link>
            )}

            {/* Cart with Dropdown */}
            {user.accessToken && (
              <div className="relative group">
                <Link
                  to={path.USER_CART}
                  className="w-10 h-10 rounded-xl bg-gray-50/90 hover:bg-red-50 text-gray-700 hover:text-main border border-gray-100 hover:border-red-100 flex items-center justify-center transition-all duration-200 shadow-2xs relative cursor-pointer"
                  title="Giỏ hàng của bạn"
                >
                  <FaShoppingCart className="text-base transition-transform group-hover:scale-110" />
                  {user.userData?.carts?.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-main text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                      {user.userData?.carts?.length}
                    </span>
                  )}
                </Link>

                {/* Cart Hover Dropdown */}
                <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <Cart />
                  </div>
                </div>
              </div>
            )}

            {/* User Profile Avatar with Dropdown */}
            {user.accessToken ? (
              <div className="relative group pl-1">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-main via-rose-400 to-amber-400 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={user.userData?.avatar?.url || DefaultUser}
                      className="w-full h-full object-cover"
                      alt={user.userData?.lastName || "User"}
                      onError={(e) => {
                        e.target.src = DefaultUser;
                      }}
                    />
                  </div>
                </div>

                {/* Modern User Dropdown Menu */}
                <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50">
                  <div className="w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 divide-y divide-gray-100 overflow-hidden">
                    {/* User Greeting Card Header */}
                    <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-slate-50/50">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.userData?.firstName} {user.userData?.lastName}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {user.userData?.email}
                      </p>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1">
                      {userDropdown.map((item) => {
                        if (item.role === "admin" && user.userData?.role !== "admin") return null;

                        if (item.title === "Đăng xuất") {
                          return (
                            <button
                              key={item.title}
                              onClick={() => item?.onClick(handleLogout)}
                              className="w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                            >
                              <span>{item.title}</span>
                              <span className="text-sm text-red-500">{item.icon}</span>
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.title}
                            to={item?.navigation}
                            className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-main flex items-center justify-between transition-colors"
                          >
                            <span>{item.title}</span>
                            <span className="text-sm text-gray-400 group-hover:text-main">{item.icon}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={`/${path.LOGIN}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-main hover:bg-red-600 rounded-xl transition-all duration-200 shadow-sm shadow-red-500/20"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
