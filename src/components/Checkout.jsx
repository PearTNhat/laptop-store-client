import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiCreateOrder, apiCreateOrderCOD } from "~/apis/order";
import { fetchCurrentUser } from "~/store/action/user";
import { Logo } from "~/assets/images";
import { formatNumber } from "~/utils/helper";
import InputForm from "./InputForm";
import path from "~/constants/path";
import {
  FiArrowLeft,
  FiShield,
  FiMapPin,
  FiPhone,
  FiUser,
  FiTruck,
  FiCheckCircle,
  FiCreditCard,
  FiLock,
  FiShoppingBag,
} from "react-icons/fi";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, accessToken } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "MOMO"

  const carts = userData?.carts || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: (userData?.firstName ? userData?.firstName + " " : "") + (userData?.lastName || ""),
      phone: userData?.phone || "",
      address: userData?.address || "",
    },
  });

  const total = carts.reduce(
    (acc, cart) =>
      acc + (cart.product?.discountPrice || cart.product?.price || 0) * (cart.quantity || 1),
    0
  );

  const handleCheckout = async (data) => {
    if (!carts || carts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống",
        text: "Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán.",
      });
      navigate(`/${path.HOME}`);
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "COD") {
        const body = {
          products: carts,
          total,
          name: data.name.trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          payName: "COD",
        };

        const response = await apiCreateOrderCOD({
          accessToken,
          body,
        });

        if (response?.success) {
          dispatch(fetchCurrentUser({ token: accessToken }));
          await Swal.fire({
            icon: "success",
            title: "Đặt hàng thành công!",
            text: "Cảm ơn bạn đã mua hàng tại Laptop Store! Đơn hàng COD của bạn đã được ghi nhận và đang được xử lý.",
            confirmButtonColor: "#ee3131",
          });
          navigate(path.USER_ORDER);
        } else {
          Swal.fire({
            icon: "error",
            title: "Đặt hàng thất bại",
            text: response?.message || "Có lỗi xảy ra trong quá trình đặt hàng COD.",
          });
        }
      } else {
        const body = {
          products: carts,
          total,
          name: data.name.trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          payName: "MoMo",
        };

        const response = await apiCreateOrder({
          accessToken,
          body,
        });

        if (response?.success) {
          if (response.data?.payUrl) {
            window.location.href = response.data.payUrl;
          } else {
            dispatch(fetchCurrentUser({ token: accessToken }));
            await Swal.fire({
              icon: "success",
              title: "Đặt hàng thành công!",
              text: "Cảm ơn bạn đã mua hàng tại Laptop Store. Chúng tôi sẽ liên hệ sớm nhất.",
              confirmButtonColor: "#ee3131",
            });
            navigate(path.USER_ORDER);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Mua hàng thất bại",
            text: response?.message || "Có lỗi xảy ra trong quá trình thanh toán.",
          });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: err.message || "Không thể kết nối đến máy chủ thanh toán.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="block">
              <img src={Logo} alt="Digital World" className="h-8 w-auto object-contain" />
            </Link>
            <span className="h-5 w-[1px] bg-gray-200 hidden sm:block"></span>
            <span className="text-sm font-bold text-gray-700 hidden sm:block">
              Thanh toán an toàn
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <FiShield className="text-sm" />
              <span>Mã hóa SSL 256-bit</span>
            </div>

            <Link
              to={path.USER_CART}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-main transition-colors"
            >
              <FiArrowLeft className="text-sm" />
              <span>Quay lại giỏ hàng</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {(!carts || carts.length === 0) ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-50 text-main flex items-center justify-center text-3xl shadow-inner">
              <FiShoppingBag />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Giỏ hàng của bạn đang trống!
            </h2>
            <p className="text-xs text-gray-500">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
            </p>
            <Link
              to={`/${path.PRODUCTS_CATEGORY}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-main hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all"
            >
              <span>Mua sắm ngay</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleCheckout)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (col-span-7): Customer & Shipping & Payment */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Customer Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-main font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <FiMapPin className="text-main" />
                      <span>Thông tin giao hàng</span>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <FiUser className="text-gray-400" />
                        Họ và tên người nhận <span className="text-main">*</span>
                      </label>
                      <InputForm
                        id="name"
                        validate={{
                          required: "Vui lòng nhập họ tên người nhận",
                          validate: (value) => {
                            const trimmed = value?.trim();
                            if (!trimmed) return "Không được để trống";
                            return true;
                          },
                        }}
                        placeholder="Nguyễn Văn A"
                        register={register}
                        error={errors}
                        cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <FiPhone className="text-gray-400" />
                        Số điện thoại nhận hàng <span className="text-main">*</span>
                      </label>
                      <InputForm
                        id="phone"
                        validate={{
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^0\d{9}$/,
                            message: "Số điện thoại phải có 10 chữ số (bắt đầu bằng số 0)",
                          },
                        }}
                        placeholder="0912345678"
                        register={register}
                        error={errors}
                        cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <FiMapPin className="text-gray-400" />
                        Địa chỉ nhận hàng chi tiết <span className="text-main">*</span>
                      </label>
                      <InputForm
                        id="address"
                        validate={{
                          required: "Vui lòng nhập địa chỉ nhận hàng",
                        }}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        register={register}
                        error={errors}
                        cssInput="!border-gray-200 !rounded-xl !py-2.5 !px-3.5 focus:!border-main focus:!ring-2 focus:!ring-main/20 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-main font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <FiCreditCard className="text-main" />
                      <span>Phương thức thanh toán</span>
                    </h2>
                  </div>

                  <div className="pt-1 space-y-3">
                    {/* 1. COD Payment Option */}
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        paymentMethod === "COD"
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 transition-colors ${
                            paymentMethod === "COD"
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <FiTruck className="text-2xl" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-900">
                              Thanh toán khi nhận hàng (COD)
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Khuyên dùng
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                            Nhận hàng, kiểm tra sản phẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng
                          </p>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            paymentMethod === "COD"
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {paymentMethod === "COD" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. MoMo Payment Gateway Card */}
                    <div
                      onClick={() => setPaymentMethod("MOMO")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        paymentMethod === "MOMO"
                          ? "border-[#a50064] bg-[#fdf2f8] shadow-xs ring-1 ring-[#a50064]/20"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* MoMo Official Styled Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                          style={{
                            backgroundColor: "#a50064",
                          }}
                        >
                          <span
                            className="font-extrabold text-sm tracking-tight select-none"
                            style={{ color: "#ffffff" }}
                          >
                            MoMo
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-900">
                              Cổng thanh toán trực tuyến MoMo
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#a50064] text-[10px] font-semibold border border-purple-100">
                              Ví điện tử
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                            Hỗ trợ Ví MoMo, Quét mã QR Ngân hàng (VietQR), Thẻ ATM nội địa & Quốc tế
                          </p>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            paymentMethod === "MOMO"
                              ? "border-[#a50064] bg-[#a50064] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {paymentMethod === "MOMO" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (col-span-5): Sticky Order Review Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                      Đơn hàng của bạn
                    </h2>
                    <span className="text-xs font-semibold text-gray-500">
                      {carts.length} sản phẩm
                    </span>
                  </div>

                  {/* Products Mini List */}
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-50">
                    {carts.map((cart, idx) => {
                      const color =
                        cart.product?.colors?.find(
                          (c) => c.color?.toLowerCase() === cart.color?.toLowerCase()
                        ) || cart.product?.colors?.[0] || {};
                      const itemPrice = cart.product?.discountPrice || cart.product?.price || 0;

                      return (
                        <div
                          key={cart._id || idx}
                          className="pt-3 first:pt-0 flex items-center gap-3"
                        >
                          <div className="relative w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={color?.primaryImage?.url || cart.product?.primaryImage?.url}
                              alt={cart.product?.title}
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                              {cart.quantity}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate" title={cart.product?.title}>
                              {cart.product?.title}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Màu: <span className="font-medium text-gray-700">{cart.color}</span>
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-gray-900">
                              {formatNumber(itemPrice * cart.quantity)}₫
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(total)}₫
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiTruck className="text-emerald-600" />
                        Phí vận chuyển
                      </span>
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">
                        Miễn phí
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">Tổng thanh toán</span>
                        <span className="text-[10px] text-gray-400">(Đã bao gồm thuế VAT)</span>
                      </div>
                      <span className="text-xl font-black text-main">
                        {formatNumber(total)}₫
                      </span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-main hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-70 cursor-pointer"
                  >
                    <FiLock className="text-sm" />
                    <span>
                      {loading
                        ? (paymentMethod === "COD" ? "Đang xử lý đặt hàng..." : "Đang kết nối cổng MoMo...")
                        : (paymentMethod === "COD"
                            ? `Đặt hàng COD (${formatNumber(total)}₫)`
                            : `Thanh toán qua MoMo (${formatNumber(total)}₫)`)}
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    Bằng việc bấm nút, bạn đồng ý với các điều khoản mua sắm của Laptop Store
                  </p>
                </div>

                {/* Guarantees */}
                <div className="bg-gradient-to-b from-gray-50 to-slate-50/70 rounded-2xl p-5 border border-gray-100 space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0" />
                    <span>Cam kết sản phẩm mới 100% chính hãng</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiShield className="text-main text-base flex-shrink-0" />
                    <span>Bảo hành chính hãng 12 - 24 tháng</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiTruck className="text-blue-600 text-base flex-shrink-0" />
                    <span>Đồng kiểm ngoại quan máy khi nhận hàng</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
