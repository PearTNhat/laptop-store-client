import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiCreateOrder } from "~/apis/order";
import { Logo } from "~/assets/images";
import { formatNumber } from "~/utils/helper";
import InputForm from "./InputForm";

function Checkout() {
  const { userData, accessToken } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.firstName + " " + userData?.lastName,
      phone: userData?.phone,
      address: userData?.address,
    },
  });
  const navigate = useNavigate();
  const [total] = useState(() =>
    userData?.carts.reduce(
      (acc, cart) => acc + cart.product.discountPrice * cart.quantity,
      0
    )
  );
  const handleCheckout = async (data) => {
    const body = {
      products: userData.carts,
      total,
      ...data
    };
    const response = await apiCreateOrder({
      accessToken,
      body,
    });
    if (response?.success) {
      Swal.fire({
        icon: "success",
        title: "Mua hàng thành công",
      });
      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Mua hàng thất bại",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(handleCheckout)}>
      <div className="flex gap-4">
        <div className="px-2 py-4 w-[40%]">
          <div className="">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold text-xl text-center">
              Thông tin khách hàng
            </h2>
            <InputForm
              cssParents={"flex-1"}
              id="name"
              validate={{ required: "Không được để trống" }}
              label="Tên"
              register={register}
              error={errors}
            />
            <InputForm
              cssParents={"flex-1"}
              id="phone"
              validate={{
                required: "Không được để trống",
                pattern: {
                  value: /^0\d{9}$/,
                  message: "Số điện thoại phải có 10 số và bắt đầu bằng số 0.",
                },
              }}
              label="Số điện thoại"
              register={register}
              error={errors}
            />
            <InputForm
              id="address"
              cssParents={"flex-1"}
              validate={{
                required: "Không được để trống",
              }}
              label="Địa chỉ"
              register={register}
              error={errors}
            />
          </div>
        </div>
        <div className="w-[60%] h-screen overflow-auto py-2">
          <table className="table-auto w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="p-2 text-left">Ảnh</th>
                <th className="p-2 text-left">Tên</th>
                <th className="p-2 text-left">Màu</th>
                <th className="p-2 text-left text-nowrap">Số lượng</th>
                <th className="p-2 text-right">Giá</th>
              </tr>
            </thead>
            <tbody className="border border-gray-300">
              {userData?.carts?.map((cart) => {
                //  vì có 1 sản phẩm nên k cần color
                const color = cart.product.colors.find(
                  (color) => color.color === cart.color
                );
                return (
                  <tr key={cart._id} className="border-b border-b-gray-300">
                    <td className="p-2">
                      <img
                        src={color.primaryImage.url}
                        className=" w-[80px]"
                        alt=""
                      />
                    </td>
                    <td className="p-2" title={cart.product.title}>
                      <p className="line-clamp-2">{cart.product.title}</p>
                    </td>
                    <td className="p-2">{cart.color}</td>
                    <td className="p-2 text-center">{cart.quantity}</td>
                    <td className="text-right p-2">
                      {formatNumber(cart.product.discountPrice)}₫
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end mt-2 gap-2">
            <div className="">
              <span className="font-semibold">Total: </span>
              <span className="text-main">{formatNumber(total)}₫</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className=" bg-main text-white rounded-md px-10 py-2 mt-2"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Checkout;
