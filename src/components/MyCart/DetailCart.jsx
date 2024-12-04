import { useDispatch, useSelector } from "react-redux";
import QuantityInput from "../QuantityInput";
import { useState } from "react";
import { formatNumber } from "~/utils/helper";
import { apiRemoveCartItem, apiUpdateCart } from "~/apis/user";
import { Toast } from "~/utils/alert";
import { fetchCurrentUser } from "~/store/action/user";
import { FaRegTrashAlt } from "react-icons/fa";
import path from "~/constants/path";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DetailCart() {
  const {
    userData: { carts, address, phone },
    accessToken,
  } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(() =>
    carts.reduce((acc, cart) => ({ ...acc, [cart._id]: cart.quantity }), {})
  );
  const handleUpdateQuantity = async ({ product, color, quantity }) => {
    const response = await apiUpdateCart({
      accessToken,
      body: { product, color, quantity },
    });
    if (response?.success) {
      Toast.fire({ icon: "success", title: "Cập nhật số lương thành công" });
      dispatch(fetchCurrentUser({ token: accessToken }));
    } else {
      Toast.fire({ icon: "error", title: "Cập nhật số lương thât bại" });
    }
  };
  const handleCheckout = async () => {
    if (!address || !phone) {
      let text;
      if (!address && !phone) {
        text = "address and phone number";
      } else {
        text = !address ? "address" : !phone ? "phone number" : "";
      }
      await Swal.fire({
        icon: "info",
        title: "Almost!",
        text: `Please update your ${text} before checkout.`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Update now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result);
          navigate(path.USER_PROFILE);
        }
      });
      return;
    }
    return navigate(path.CHECKOUT);
  };
  const handleDeleteItem = async ({ product, color }) => {
    const response = await apiRemoveCartItem({
      accessToken,
      body: { product, color },
    });
    if (response?.success) {
      Toast.fire({ icon: "success", title: "Delete item successfully" });
      dispatch(fetchCurrentUser({ token: accessToken }));
    } else {
      Toast.fire({ icon: "error", title: "Fail to delete item" });
    }
  };
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-gray-100 h-[60px]">
        <h1 className="text-2xl font-semibold p-3">Danh sách giỏ hàng</h1>
      </div>
      <div className="px-3 mt-3">
        <div className="grid grid-cols-10 bg-blue-900 text-white ">
          <span className="font-semibold col-span-1 p-2">#</span>
          <span className="font-semibold col-span-5 p-2">Tên sản phẩm</span>
          <span className="font-semibold col-span-1 p-2">Số lượng</span>
          <span className="font-semibold col-span-2 p-2 text-end">Giá</span>
          <span className="font-semibold col-span-1 p-2"></span>
        </div>
        <div className="">
          {carts?.map((cart,idx) => {
            const color = cart.product.colors.find(
              (color) => color.color === cart.color
            );
            return (
              <ul
                className="grid grid-cols-10 gap-3 p-2 border border-gray-300"
                key={cart._id}
              >
                <li className="col-span-1 flex items-center justify-start">
                  {idx + 1}
                </li>
                <li className="col-span-5 flex float-start">
                  <img
                    src={color.primaryImage.url}
                    alt=""
                    className="w-[80px] flex-shrink-0"
                  />
                  <div className="pl-2 flex-1">
                    <p className="line-clamp-2">{cart.product.title}</p>
                    <p>{cart.color}</p>
                  </div>
                </li>
                <li className="col-span-1 flex items-center justify-start">
                  <QuantityInput
                    onDown={() => {
                      handleUpdateQuantity({
                        product: cart.product._id,
                        color: cart.color,
                        quantity: Number(quantity[cart._id]) - 1,
                      });
                      return setQuantity({
                        ...quantity,
                        [cart._id]: quantity[cart._id] - 1,
                      });
                    }}
                    onUp={() => {
                      handleUpdateQuantity({
                        product: cart.product._id,
                        color: cart.color,
                        quantity: Number(quantity[cart._id]) + 1,
                      });
                      return setQuantity({
                        ...quantity,
                        [cart._id]: quantity[cart._id] + 1,
                      });
                    }}
                    quantity={quantity[cart._id]}
                    setQuantity={(value) => {
                      handleUpdateQuantity({
                        product: cart.product._id,
                        color: cart.color,
                        quantity: value,
                      });
                      setQuantity((prev) => ({ ...prev, [cart._id]: value }));
                    }}
                    maxQuantity={color.quantity}
                  />
                </li>
                <li className="col-span-2 flex items-center justify-end">
                  {formatNumber(
                    cart.product.discountPrice * quantity[cart._id]
                  )}đ
                </li>
                <li className="col-span-1 flex items-center justify-center">
                  <button
                    className="p-4 flex items-center"
                    onClick={() =>
                      handleDeleteItem({
                        product: cart.product._id,
                        color: cart.color,
                      })
                    }
                  >
                    <FaRegTrashAlt />
                  </button>
                </li>
              </ul>
            );
          })}
        </div>
        <div className="flex justify-end mt-2 gap-2 pr-2">
          <span>Tổng cộng:</span>
          <span className="text-main">
            {formatNumber(
              carts.reduce(
                (acc, cart) =>
                  acc + cart.product.discountPrice * quantity[cart._id],
                0
              )
            )}
          </span>
        </div>
        <div className="flex justify-end py-2 pr-2">
          <button
            onClick={handleCheckout}
            className=" bg-main text-white rounded-md px-3 py-2 mt-2"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailCart;
