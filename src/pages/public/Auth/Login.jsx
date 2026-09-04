import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userActions } from "~/store/slice/userSlice";
import Swal from "sweetalert2";
import { apiForgetPassword, apiLogin } from "~/apis/user";
import Button from "~/components/Button";
import InputField from "~/components/InputField";
import path from "~/constants/path";
import { Toast } from "~/utils/alert";
import { validateForm } from "~/utils/helper";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FiLogIn, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [invalidField, setInvalidField] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    emailResetPassword: "",
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { email, password } = payload;
      const invalid = validateForm({ email, password }, setInvalidField);
      if (invalid > 0) return;
      setLoading(true);
      try {
        const response = await apiLogin({ email, password });
        if (!response.success) {
          Swal.fire("Oops!", response.message, "error");
        } else {
          if (response.status === 403) {
            await Swal.fire({
              title: "Tài khoản của bạn đã bị khóa",
              icon: "info",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Trở về",
            });
            return;
          }
          dispatch(
            userActions.login({
              accessToken: response.accessToken,
              userData: response.userData,
            })
          );
          Toast.fire({
            icon: "success",
            title: "Đăng nhập thành công",
          });
          navigate(`/${path.HOME}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [payload, dispatch, navigate]
  );

  useEffect(() => {
    setPayload({
      email: "",
      password: "",
      emailResetPassword: "",
    });
    setInvalidField([]);
  }, [isForgetPassword]);

  const handleForgetPassword = async (email) => {
    let invalid = validateForm({ emailResetPassword: email }, setInvalidField);
    if (invalid > 0) return;
    const res = await apiForgetPassword(email);
    if (res.success) {
      Swal.fire("Success", res.message, "success");
      setIsForgetPassword(false);
    } else {
      Swal.fire("Oops!", res.message, "error");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 relative overflow-hidden">
        {/* Forgot Password Pane */}
        <div
          className={`absolute inset-0 bg-white z-20 p-8 flex flex-col justify-center ${
            isForgetPassword
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          } transition-all duration-300`}
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FiMail className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Quên mật khẩu?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              setInvalidField={setInvalidField}
              placeholder="Email của bạn"
              nameKey="emailResetPassword"
              value={payload.emailResetPassword}
              setPayload={setPayload}
              invalidField={invalidField}
              cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
            />
            <button
              type="button"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all text-sm"
              onClick={() => handleForgetPassword(payload.emailResetPassword)}
            >
              Gửi yêu cầu
            </button>
            <button
              type="button"
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
              onClick={() => setIsForgetPassword(false)}
            >
              <FiArrowLeft className="text-sm" />
              <span>Quay lại đăng nhập</span>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-main flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FiLogIn className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Đăng nhập
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Chào mừng bạn quay trở lại với Digital World
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <InputField
              setInvalidField={setInvalidField}
              cssDiv="!mb-0"
              placeholder="nhapemail@example.com"
              value={payload.email}
              nameKey="email"
              type="email"
              setPayload={setPayload}
              invalidField={invalidField}
              cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setIsForgetPassword(true)}
                className="text-xs font-medium text-main hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <InputField
              setInvalidField={setInvalidField}
              cssDiv="!mb-0"
              placeholder="••••••••"
              type={isShowPassword ? "text" : "password"}
              value={payload.password}
              nameKey="password"
              invalidField={invalidField}
              setPayload={setPayload}
              cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm shadow-xs"
              icon={
                <span className="text-gray-400 hover:text-gray-600 text-base">
                  {isShowPassword ? (
                    <IoEyeSharp onClick={() => setIsShowPassword(false)} />
                  ) : (
                    <FaEyeSlash onClick={() => setIsShowPassword(true)} />
                  )}
                </span>
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-main hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 text-sm transform active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
              Chưa có tài khoản?
            </span>
          </div>

          <Link
            to={`/${path.REGISTER}`}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl border border-gray-200 transition-all text-xs flex items-center justify-center gap-2"
          >
            <span>Tạo tài khoản mới</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
