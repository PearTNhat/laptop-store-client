import moment from "moment";
import { useEffect, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoCloseSharp, IoEyeSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFinalRegister, apiRegister } from "~/apis/user";
import CountDown from "~/components/CountDown";
import InputField from "~/components/InputField";
import Loading from "~/components/Loading";
import path from "~/constants/path";
import { appActions } from "~/store/slice/app";
import { getTimeHMS, validateForm } from "~/utils/helper";
import { FiUserPlus, FiShield, FiArrowRight } from "react-icons/fi";

let countTime;

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [invalidField, setInvalidField] = useState([]);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateForm(payload, setInvalidField);
    if (invalid > 0) return;
    setLoading(true);
    dispatch(
      appActions.toggleModal({ isShowModal: true, childrenModal: <Loading /> })
    );
    try {
      const response = await apiRegister(payload);
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      if (!response.success) {
        setVerifyOtp(false);
        Swal.fire("Oops!", response.message, "error");
      } else {
        setVerifyOtp(true);
      }
    } catch (error) {
      dispatch(
        appActions.toggleModal({ isShowModal: false, childrenModal: null })
      );
      setVerifyOtp(false);
      Swal.fire("Oops!", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const { email, OTP } = payload;
    if (!OTP?.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập mã OTP", "warning");
      return;
    }
    const response = await apiFinalRegister({ email, OTP });
    if (!response.success) {
      Swal.fire("Oops!", response.message, "error");
    } else {
      Swal.fire(
        "Thành công!",
        "Đăng ký tài khoản thành công. Vui lòng đăng nhập.",
        "success"
      );
      navigate(`/${path.LOGIN}`);
    }
  };

  useEffect(() => {
    if (!verifyOtp) return;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    countTime = setInterval(() => {
      const distance =
        new Date(today).getTime() + 5 * 60 * 1000 - Number(Date.now());
      const { hours, minutes, seconds } = getTimeHMS(distance);
      setTime({ hours, minutes, seconds });
    }, 1000);
    return () => {
      clearInterval(countTime);
    };
  }, [verifyOtp]);

  return (
    <>
      {/* OTP Verification Modal */}
      {verifyOtp && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 relative border border-gray-100">
            <button
              onClick={() => setVerifyOtp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoCloseSharp className="text-xl" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-main flex items-center justify-center mx-auto mb-3 shadow-inner">
                <FiShield className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Xác thực tài khoản
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Mã xác thực đã được gửi tới email{" "}
                <strong className="text-gray-800">{payload.email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="flex gap-2 justify-center py-2">
                <CountDown text="Phút" number={time.minutes} />
                <CountDown text="Giây" number={time.seconds} />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Nhập mã OTP 6 chữ số"
                  className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-main focus:bg-white focus:ring-2 focus:ring-main/20 transition-all placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                  onChange={(e) =>
                    setPayload({ ...payload, OTP: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-main hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all text-sm transform active:scale-[0.99]"
              >
                Xác thực ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Register Form */}
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-main flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FiUserPlus className="text-2xl" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Tạo tài khoản mới
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Đăng ký để nhận những ưu đãi và mua sắm dễ dàng hơn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ
                </label>
                <InputField
                  setInvalidField={setInvalidField}
                  cssDiv="!mb-0"
                  placeholder="Nguyễn"
                  nameKey="firstName"
                  value={payload.firstName}
                  setPayload={setPayload}
                  invalidField={invalidField}
                  cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên
                </label>
                <InputField
                  setInvalidField={setInvalidField}
                  cssDiv="!mb-0"
                  placeholder="Văn A"
                  nameKey="lastName"
                  value={payload.lastName}
                  setPayload={setPayload}
                  invalidField={invalidField}
                  cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm shadow-xs"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu
              </label>
              <InputField
                setInvalidField={setInvalidField}
                cssDiv="!mb-0"
                placeholder="Tối thiểu 6 ký tự"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <InputField
                setInvalidField={setInvalidField}
                cssDiv="!mb-0"
                placeholder="Nhập lại mật khẩu"
                type={isShowConfirmPassword ? "text" : "password"}
                value={payload.confirmPassword}
                nameKey="confirmPassword"
                setPayload={setPayload}
                invalidField={invalidField}
                cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm shadow-xs"
                icon={
                  <span className="text-gray-400 hover:text-gray-600 text-base">
                    {isShowConfirmPassword ? (
                      <IoEyeSharp
                        onClick={() => setIsShowConfirmPassword(false)}
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => setIsShowConfirmPassword(true)}
                      />
                    )}
                  </span>
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-main hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 text-sm transform active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                Đã có tài khoản?
              </span>
            </div>

            <Link
              to={`/${path.LOGIN}`}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl border border-gray-200 transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <span>Đăng nhập ngay</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
