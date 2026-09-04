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
      title: "Logout successfully",
    });
  };
  useEffect(() => {
    dispatch(fetchBrands());
  }, []);
  return (
    <div className="main-container py-6">
      <div className="flex justify-between items-center">
        <div className="w-[200px]">
          <Link to={`/${path.HOME}`}>
            <img src={Logo} alt="logo-digital" className="w-full object-contain" />
          </Link>
        </div>

        <div className="flex justify-center items-center gap-8">
          {/* phone */}
          <div className="max-lg:hidden flex flex-col items-center">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-main text-sm" />
              <span className="font-bold text-gray-800 text-[15px]">1800 900</span>
            </div>
            <div className="text-[12px] text-gray-500 mt-1">Mon-Sat 9:00AM - 6:00PM</div>
          </div>
          {/* mail */}
          <div className="max-lg:hidden flex flex-col items-center">
            <div className="flex items-center gap-2">
              <MdEmail className="text-main text-[16px]" />
              <span className="font-bold text-gray-800 text-[15px]">abc.support@gmail.com</span>
            </div>
            <div className="text-[12px] text-gray-500 mt-1">Hỗ trợ trực tuyến 24/7</div>
          </div>
          {/* wishlist */}
          {user.accessToken && (
            <Link
              to={path.USER_WISHLIST}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-main transition-colors text-gray-600 ml-4"
            >
              <FaRegHeart className="text-xl" />
            </Link>
          )}
          {/* cart */}
          {user.accessToken && (
            <div
              className={`px-[20px] relative group  ${
                user.accessToken && `border-r border-r-gray-300`
              } text-gray-900 cursor-pointer flex h-[37.5px] items-center`}
            >
              <FaShoppingCart className="text-xl" />
              {user.userData?.carts?.length > 0 && (
                <span className="absolute bg-main top-[2px] right-[11px] p-2 leading-none text-white w-[10px] h-[10px] rounded-full flex justify-center items-center text-[10px]">
                  {user.userData?.carts?.length}
                </span>
              )}
              <div className="group-hover:block dropdown py-2 px-1">
                <Cart />
              </div>
            </div>
          )}
          {/* User */}
          {user.accessToken && (
            <div className="pl-[20px]">
              <div className="w-[40px] h-[40px]  cursor-pointer">
                <div className="relative group h-full">
                  <img
                    src={`${
                      user.userData?.avatar?.url
                        ? user.userData?.avatar?.url
                        : DefaultUser
                    }`}
                    className="w-full h-full object-cover rounded-full"
                    alt="name"
                  />
                  <ul className="group-hover:block dropdown py-2 px-1">
                    {userDropdown.map((item, i) => {
                      if (
                        item.role === "admin" &&
                        user.userData.role !== "admin"
                      )
                        return null;
                      return (
                        <li
                          key={item.title}
                          className={`hover:bg-gray-300 px-2 text-nowrap ${
                            i === userDropdown.length - 1
                              ? ""
                              : "border-gray-300 border-b"
                          }`}
                        >
                          {item.title === "Đăng xuất" ? (
                            <Button
                              className={
                                "flex justify-between items-center gap-5 !bg-transparent !text-black"
                              }
                              onClick={() => item?.onClick(handleLogout)}
                            >
                              <p className=" text-right text-sm w-[70px]">
                                {item.title}
                              </p>
                              {item.icon}
                            </Button>
                          ) : (
                            <Button
                              to={item?.navigation}
                              className={
                                "flex justify-between items-center gap-5 !bg-transparent !text-black"
                              }
                            >
                              <p className=" text-right text-sm w-[70px]">
                                {item.title}
                              </p>
                              {item.icon}
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
