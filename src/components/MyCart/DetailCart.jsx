import { useDispatch, useSelector } from "react-redux";
import QuantityInput from "../QuantityInput";
import { useEffect, useState } from "react";
import { formatNumber } from "~/utils/helper";
import { apiRemoveCartItem, apiUpdateCart } from "~/apis/user";
import { Toast } from "~/utils/alert";
import { fetchCurrentUser } from "~/store/action/user";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import path from "~/constants/path";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function DetailCart() {
  const {
    userData: { carts = [], address, phone } = {},
    accessToken,
  } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState({});

  const handleUpdateQuantity = async ({ product, color, quantity: newQty }) => {
    if (newQty < 1) return;
    const response = await apiUpdateCart({
      accessToken,
      body: { product, color, quantity: newQty },
    });
    if (response?.success) {
      Toast.fire({ icon: "success", title: "Cập nhật số lượng thành công" });
      dispatch(fetchCurrentUser({ token: accessToken }));
    } else {
      Toast.fire({ icon: "error", title: "Cập nhật số lượng thất bại" });
    }
  };

  const handleCheckout = async () => {
    if (!address || !phone) {
      let text = !address && !phone ? "Địa chỉ và số điện thoại" : !address ? "địa chỉ" : "số điện thoại";
      await Swal.fire({
        icon: "info",
        title: "Thông tin giao hàng chưa đầy đủ",
        text: `Vui lòng cập nhật ${text} của bạn để tiếp tục đặt hàng.`,
        showCancelButton: true,
        confirmButtonColor: "#ee3131",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Cập nhật ngay",
        cancelButtonText: "Để sau",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(path.USER_PROFILE);
        }
      });
      return;
    }
    return navigate(path.CHECKOUT);
  };

  const handleDeleteItem = async ({ product, color }) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ee3131",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Giữ lại",
    });

    if (!result.isConfirmed) return;

    const response = await apiRemoveCartItem({
      accessToken,
      body: { product, color },
    });
    if (response?.success) {
      Toast.fire({ icon: "success", title: "Xóa sản phẩm thành công" });
      dispatch(fetchCurrentUser({ token: accessToken }));
    } else {
      Toast.fire({ icon: "error", title: "Xảy ra lỗi khi xóa sản phẩm" });
    }
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser({ token: accessToken }));
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      setQuantity(
        carts.reduce((acc, cart) => ({ ...acc, [cart._id]: cart.quantity }), {})
      );
    }
  }, [carts]);

  const totalCartAmount = carts.reduce((acc, cart) => {
    const qty = quantity[cart._id] || cart.quantity || 1;
    const price = cart.product?.discountPrice || cart.product?.price || 0;
    return acc + price * qty;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiShoppingBag className="text-main text-2xl" />
            <span>Giỏ hàng của bạn</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý các sản phẩm laptop bạn đã chọn và tiến hành đặt hàng
          </p>
        </div>
        <span className="px-3 py-1 bg-red-50 text-main font-bold text-xs rounded-full border border-red-100">
          {carts?.length || 0} sản phẩm
        </span>
      </div>

      {/* Cart Body */}
      {(!carts || carts.length === 0) ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-red-50 text-main flex items-center justify-center text-4xl shadow-inner">
            <FiShoppingBag />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            Giỏ hàng của bạn đang trống!
          </h2>
          <p className="text-xs text-gray-500 max-w-md">
            Hiện tại bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá ngay hàng loạt mẫu laptop cao cấp chính hãng tại cửa hàng nhé.
          </p>
          <Link
            to={`/${path.PRODUCTS_CATEGORY}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-main hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all transform active:scale-98"
          >
            <span>Khám phá sản phẩm ngay</span>
            <FiArrowRight className="text-sm" />
          </Link>
        </div>
      ) : (
        /* 2-Column Cart Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Items List (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {carts.map((cart, idx) => {
              const color =
                cart.product?.colors?.find(
                  (c) => c.color?.toLowerCase() === cart.color?.toLowerCase()
                ) || cart.product?.colors?.[0] || {};
              const currentQty = quantity[cart._id] || cart.quantity || 1;
              const unitPrice = cart.product?.discountPrice || cart.product?.price || 0;
              const originalPrice = cart.product?.price;

              return (
                <div
                  key={cart._id || idx}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/${cart.product?.slug}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2 flex items-center justify-center group"
                  >
                    <img
                      src={color?.primaryImage?.url || cart.product?.primaryImage?.url}
                      alt={cart.product?.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full sm:w-auto">
                    <Link
                      to={`/${cart.product?.slug}`}
                      className="text-sm font-bold text-gray-900 hover:text-main line-clamp-2 transition-colors leading-snug"
                    >
                      {cart.product?.title}
                    </Link>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <span>Màu:</span>
                        <span className="font-semibold">{cart.color}</span>
                      </span>
                      {color?.quantity !== undefined && (
                        <span className="text-[11px] text-gray-400">
                          (Còn {color.quantity} máy)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-base font-black text-main">
                        {formatNumber(unitPrice)}₫
                      </span>
                      {originalPrice && originalPrice > unitPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatNumber(originalPrice)}₫
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <QuantityInput
                      onDown={() => {
                        const newQ = currentQty - 1;
                        if (newQ >= 1) {
                          handleUpdateQuantity({
                            product: cart.product?._id,
                            color: cart.color,
                            quantity: newQ,
                          });
                          setQuantity({ ...quantity, [cart._id]: newQ });
                        }
                      }}
                      onUp={() => {
                        const max = color?.quantity || 99;
                        const newQ = currentQty + 1;
                        if (newQ <= max) {
                          handleUpdateQuantity({
                            product: cart.product?._id,
                            color: cart.color,
                            quantity: newQ,
                          });
                          setQuantity({ ...quantity, [cart._id]: newQ });
                        }
                      }}
                      quantity={currentQty}
                      setQuantity={(value) => {
                        handleUpdateQuantity({
                          product: cart.product?._id,
                          color: cart.color,
                          quantity: value,
                        });
                        setQuantity((prev) => ({ ...prev, [cart._id]: value }));
                      }}
                      maxQuantity={color?.quantity || 99}
                    />

                    <div className="text-right sm:text-center">
                      <span className="block text-xs font-black text-gray-900 sm:hidden">
                        {formatNumber(unitPrice * currentQty)}₫
                      </span>
                      <button
                        onClick={() =>
                          handleDeleteItem({
                            product: cart.product?._id,
                            color: cart.color,
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <FaRegTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary (col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({carts.length} món)</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(totalCartAmount)}₫
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiTruck className="text-emerald-600" />
                    Phí vận chuyển
                  </span>
                  <span className="font-bold text-emerald-600 uppercase tracking-wide text-[11px]">
                    Miễn phí
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Bảo hiểm & Đóng gói</span>
                  <span className="text-emerald-600 font-semibold">Miễn phí</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Tổng thanh toán</span>
                    <span className="text-[10px] text-gray-400">(Đã bao gồm thuế VAT)</span>
                  </div>
                  <span className="text-xl font-black text-main">
                    {formatNumber(totalCartAmount)}₫
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-main hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                <span>Tiến hành đặt hàng</span>
                <FiArrowRight className="text-base" />
              </button>

              <Link
                to={`/${path.PRODUCTS_CATEGORY}`}
                className="block text-center text-xs font-semibold text-gray-500 hover:text-main transition-colors"
              >
                ← Tiếp tục xem thêm sản phẩm khác
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-b from-gray-50 to-slate-50/70 rounded-2xl p-5 border border-gray-100/80 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <FiShield className="text-main text-base flex-shrink-0" />
                <span>Cam kết chính hãng 100% - Bảo hành hãng</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0" />
                <span>Đồng kiểm ngoại quan trước khi nhận hàng</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <FiTruck className="text-blue-600 text-base flex-shrink-0" />
                <span>Giao hàng toàn quốc từ 1 - 3 ngày làm việc</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailCart;
