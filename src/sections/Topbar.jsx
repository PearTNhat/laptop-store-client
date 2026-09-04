import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import path from "~/constants/path";
import { fetchCurrentUser } from "~/store/action/user";
import { FiLogIn, FiUserPlus, FiPhoneCall, FiUser } from "react-icons/fi";

function Topbar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user.accessToken) return;
    dispatch(fetchCurrentUser({ token: user.accessToken }));
  }, [user.accessToken]);

  return (
    <div className="bg-gray-900 text-gray-200 border-b border-gray-800">
      <div className="main-container flex justify-between items-center py-2 text-xs">
        <div className="flex items-center gap-2 font-medium text-gray-300">
          <FiPhoneCall className="text-main text-sm" />
          <span>
            ORDER ONLINE HOẶC GỌI NGAY:{" "}
            <strong className="text-white hover:text-main cursor-pointer transition-colors">
              (+1800) 000 8808
            </strong>
          </span>
        </div>

        {user.accessToken ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-300">
              <FiUser className="text-sm text-main" />
              <span>
                Xin chào,{" "}
                <strong className="text-white">
                  {user.userData?.lastName || user.userData?.firstname || "bạn"}
                </strong>
              </span>
            </div>
            <Link
              to={path.USER_PROFILE}
              className="px-2.5 py-1 text-[11px] font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded border border-gray-700 transition-colors"
            >
              Tài khoản
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to={`/${path.LOGIN}`}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-main hover:bg-red-600 rounded-md transition-all duration-200 shadow-sm flex items-center gap-1.5"
            >
              <FiLogIn className="text-sm" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to={`/${path.REGISTER}`}
              className="px-3.5 py-1 text-xs font-medium text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-md transition-all duration-200 flex items-center gap-1.5"
            >
              <FiUserPlus className="text-sm" />
              <span>Đăng ký</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
