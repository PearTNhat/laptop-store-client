/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { orderStatus } from "~/constants/order";
import SelectItem from "~/components/SelectItem";
import InputField from "~/components/InputField";
import Pagination from "~/components/Pagination";
import { useDebounce } from "~/hook/useDebounce";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  apiDeleteOrder,
  apiDeleteProductOrder,
  apiGetAllOrders,
  apiUpdateInfoOrder,
  apiUpdateStatusOrderProduct,
} from "~/apis/order";
import { useSelector } from "react-redux";
import { convertObjToValueLabel, formatNumber } from "~/utils/helper";
import Swal from "sweetalert2";
import { MdCancel } from "react-icons/md";
import InputForm from "~/components/InputForm";
import { useForm } from "react-hook-form";
const tableHeaderTitleList = [
  "#",
  "Mã đơn",
  "Tổng đơn",
  "Tổng tiền",
  "Người đặt",
  "SĐT",
  "Địa chỉ",
  "Ngày đặt",
  "Chức năng",
];
function MangeProduct() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isEditProduct, setIsEditProduct] = useState(null);
  const [isEditOrder, setIsEditOrder] = useState(null);
  const [payload, setPayload] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [filter, setFilter] = useState({
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const fetchAllOrders = async (params) => {
    const response = await apiGetAllOrders({ params, accessToken });
    if (response.success) {
      const totalPage = Math.ceil(response.counts / 10);
      if (totalPage < currentPage) {
        setCurrentPage(currentPage - 1);
      }
      setTotalPageCount(totalPage);
      setOrders(response.data);
    }
  };
  const handleRowClick = (product) => {
    const isSelected = selectedProduct.some((p) => p === product._id);
    if (isSelected) {
      setSelectedProduct(selectedProduct.filter((p) => p !== product._id));
      return;
    }
    setSelectedProduct([...selectedProduct, product._id]);
  };
  const handleUpdateStatusProduct = async () => {
    const response = await apiUpdateStatusOrderProduct({
      orderId: payload.orderId,
      productId: payload.productId,
      status: payload.status,
      accessToken,
    });
    if (response.success) {
      fetchAllOrders({ page: currentPage, limit: 10 });
      setIsEditProduct(null);
      Swal.fire({
        title: "Cập nhật trạng thái thành công",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Đã xảy ra lỗi",
        icon: "error",
      });
    }
  };
  const handleUpdateInfoOrder = async (data) => {
    
    const response = await apiUpdateInfoOrder({
      orderId:payload.orderId,
      accessToken,
      body:data,
    })
    if(response.success){
      fetchAllOrders({ page: currentPage, limit: 10 });
      setIsEditOrder(null);
      setPayload({});
      Swal.fire({
        title: "Cập nhật thông tin đơn hàng thành công", icon: "success"})
      }else{
        Swal.fire({
          title: "Đã xảy ra lỗi", icon: "error"
        })
      }
  };
  const handleDeleteOrder = async ({ title, _id }) => {
    const result = await Swal.fire({
      title: title,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Đồng ý",
    });
    if (result.isDismissed) return;
    if (result.isConfirmed) {
      const response = await apiDeleteOrder({ orderId: _id, accessToken });
      if (response.success) {
        fetchAllOrders({ page: currentPage, limit: 10 });
        Swal.fire({
          title: "Đã xóa thành công",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Đã xảy ra lỗi",
          icon: "error",
        });
      }
    }
  };
  const handleDeleteProductOrder = async ({ orderId, productId }) => {
    const result = await Swal.fire({
      title: "Bạn có muốn xóa sản phẩm này không",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Đồng ý",
    });
    if (result.isDismissed) return;
    if (result.isConfirmed) {
      const response = await apiDeleteProductOrder({
        orderId,
        productId,
        accessToken,
      });
      if (response.success) {
        fetchAllOrders({ page: currentPage, limit: 10 });
        Swal.fire({
          title: "Đã xóa thành công",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Đã xảy ra lỗi",
          icon: "error",
        });
      }
    }
  };
  const debounceSearch = useDebounce(filter.title, 500);
  useEffect(() => {
    // chay lan dau tien
    fetchAllOrders({ page: 1, limit: 10 });
  }, []);
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
    };
    const search = {};
    if (filter.title) {
      search.title = filter.title;
    }
    if (!search) return;
    fetchAllOrders({ ...params, ...search });
  }, [currentParams]);
  useEffect(() => {
    setSearchParams({
      ...currentParams,
      page: currentPage,
      title: debounceSearch,
    });
  }, [currentPage, debounceSearch]);
  return (
    <div className="h-screen overflow-auto">
      <h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1>
      <div className="">
        <form onSubmit={handleSubmit(handleUpdateInfoOrder)}>
          <div className="flex justify-end mr-4 gap-3">
            <SelectItem
              className="z-50"
              isClearable
              isSearchable
              placeholder="Chọn trạng thái"
              options={[
                { value: "-1", label: "Hủy đơn" },
                { value: "0", label: "Đang xử lý" },
                { value: "1", label: "Thành công" },
              ]}
              onChange={(data) => {
                // setFilter((prev) => ({ ...prev, status: data?.value }));
              }}
            />
            <InputField
              type="text"
              placeholder={"Tìm kiếm mã đơn hàng, thông tin khách hàng"}
              className="px-4 py-[0.625rem] border-gray-200 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => {
                let value = e.target.value;
                if (value.startsWith(" ")) {
                  value = value.trim();
                }
                setFilter((prev) => ({ ...prev, title: value }));
              }}
            />
          </div>
          {isEditOrder && (
            <button
              type="submit"
              className="bg-blue-600  hover:bg-blue-700 text-white h-[40px] px-3 rounded-md"
            >
              Cập nhật
            </button>
          )}
          {isEditProduct && (
            <button
              type="button"
              className="bg-blue-600  hover:bg-blue-700 text-white h-[40px] px-3 rounded-md"
              onClick={handleUpdateStatusProduct}
            >
              Cập nhật
            </button>
          )}
          <div className="py-4">
            <div className="shadow">
              <table className="w-full">
                <thead className="">
                  <tr className="border-gray-200 border-y bg-blue-900 text-white">
                    {tableHeaderTitleList.map((title) => (
                      <th
                        key={title}
                        className="text-left px-1 py-2"
                        scope="col"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order, index) => {
                    const isSelected = selectedProduct.some(
                      (item) => item === order._id
                    );
                    return (
                      <Fragment key={order._id}>
                        <tr
                          onClick={() => handleRowClick(order)}
                          className="cursor-pointer"
                        >
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {(currentPage - 1) * 10 + index + 1}
                          </td>
                          <td
                            className="p-1 border-gray-200 border-b text-sm max-w-[200px]"
                            title={order._id}
                          >
                            <p className="line-clamp-2">{order._id}</p>
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {order.products.length} sản phẩm
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {formatNumber(order.total)}đ
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {isEditOrder === order._id ? (
                              <InputForm
                                onClick={(e) => e.stopPropagation()}
                                defaultValue={order.name}
                                cssParents={"flex-1"}
                                id="name"
                                validate={{ required: "Không được để trống" }}
                                register={register}
                                error={errors}
                              />
                            ) : (
                              <p className="line-clamp-2" title={order.name}>
                                {order.name}
                              </p>
                            )}
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {isEditOrder === order._id ? (
                              <InputForm
                                onClick={(e) => e.stopPropagation()}
                                defaultValue={order.phone}
                                cssParents={"flex-1"}
                                id="phone"
                                validate={{
                                  required: "Không được để trống",
                                  pattern: {
                                    value: /^0\d{9}$/,
                                    message:
                                      "Số điện thoại phải có 10 số và bắt đầu bằng số 0.",
                                  },
                                }}
                                register={register}
                                error={errors}
                              />
                            ) : (
                              <p className="line-clamp-2" title={order.address}>
                                {order.phone}
                              </p>
                            )}
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            {isEditOrder === order._id ? (
                              <InputForm
                                onClick={(e) => e.stopPropagation()}
                                defaultValue={order.address}
                                id="address"
                                cssParents={"flex-1"}
                                validate={{
                                  required: "Không được để trống",
                                }}
                                register={register}
                                error={errors}
                              />
                            ) : (
                              <p className="line-clamp-2" title={order.address}>
                                {order.address}
                              </p>
                            )}
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            <p>
                              {moment(order.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </p>
                          </td>
                          <td className="p-1 border-gray-200 border-b text-sm">
                            <div className="flex items-center justify-center text-[16px]">
                              {/* edit */}
                              <button
                                type="button"
                                className={`mr-3 ${
                                  isEditOrder === order._id
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-yellow-400 hover:text-yellow-600"
                                } `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isEditOrder) {
                                    setIsEditOrder(null);
                                  } else {
                                    setIsEditOrder(order._id);
                                    setPayload({orderId:order._id});
                                  }
                                }}
                              >
                                {isEditOrder === order._id ? (
                                  <MdCancel className=" text-[18px]" />
                                ) : (
                                  <FaRegEdit className=" text-[18px]" />
                                )}
                              </button>
                              {/* delete */}
                              <button
                                type="button"
                                className="p-2 text-red-600 hover:text-red-900 disabled:opacity-70  hover:underline`}"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder({
                                    title: "Bạn có muốn xóa đơn hàng này không",
                                    _id: order._id,
                                  });
                                }}
                              >
                                <FaRegTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isSelected && (
                          <tr className="animate-drop-down-animation">
                            <td
                              colSpan="12"
                              className="border-gray-200 border-b text-sm font-normal text-left"
                            >
                              <table className="min-w-full bg-gray-100">
                                <thead>
                                  <tr>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      #
                                    </th>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      Tên
                                    </th>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      Màu
                                    </th>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      Số lượng
                                    </th>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      Trạng thái
                                    </th>
                                    <th className="p-2 border-gray-200 border-b text-sm">
                                      Chức năng
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.products?.map((item, idx) => {
                                    const product = item.product;
                                    return (
                                      <tr key={idx}>
                                        <td className="p-2 border-gray-200 border-b text-sm">
                                          {idx + 1}
                                        </td>
                                        <td className="p-2 border-gray-200 border-b text-sm">
                                          {product?.title}
                                        </td>
                                        <td className="p-2 border-gray-200 border-b text-sm">
                                          <div className="w-10 h-10 rounded-md overflow-hidden">
                                            <img
                                              className="object-cover object-center w-full h-full"
                                              src={product?.primaryImage.url}
                                              alt={item.color}
                                            />
                                          </div>
                                        </td>
                                        <td className="p-2 border-gray-200 border-b text-sm">
                                          {item.quantity}
                                        </td>
                                        <td className="p-2 border-gray-200 border-b text-sm">
                                          {isEditProduct === product._id ? (
                                            <SelectItem
                                              isSearchable
                                              options={convertObjToValueLabel(
                                                orderStatus
                                              )}
                                              onChange={(data) => {
                                                setPayload({
                                                  ...payload,
                                                  status: data.value,
                                                  productId: product._id,
                                                });
                                              }}
                                              defaultValue={convertObjToValueLabel(
                                                orderStatus
                                              ).find(
                                                (itm) =>
                                                  Number(itm.value) ===
                                                  item.status
                                              )}
                                            />
                                          ) : (
                                            <p
                                              className={`${
                                                item.status === 0
                                                  ? "text-yellow-400"
                                                  : "text-green-500"
                                              }`}
                                            >
                                              {orderStatus[item.status]}
                                            </p>
                                          )}
                                        </td>
                                        <td className="text-center">
                                          <div className="flex items-center text-[16px]">
                                            {/* Edit */}
                                            <button
                                              type="button"
                                              className={`mr-3 ${
                                                isEditProduct === product._id
                                                  ? "text-red-600 hover:text-red-900"
                                                  : "text-yellow-400 hover:text-yellow-600"
                                              } `}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isEditProduct) {
                                                  setIsEditProduct(null);
                                                } else {
                                                  setIsEditProduct(product._id);
                                                  setPayload({
                                                    ...payload,
                                                    orderId: order._id,
                                                  });
                                                }
                                              }}
                                            >
                                              {isEditProduct === product._id ? (
                                                <MdCancel className=" text-[18px]" />
                                              ) : (
                                                <FaRegEdit className=" text-[18px]" />
                                              )}
                                            </button>
                                            {/* Delete */}
                                            <button
                                              type="button"
                                              className="p-2 text-red-600 hover:text-red-900 disabled:opacity-70  hover:underline`}"
                                              onClick={() =>
                                                handleDeleteProductOrder({
                                                  orderId: order._id,
                                                  productId: product._id,
                                                })
                                              }
                                            >
                                              <FaRegTrashAlt />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2 mb-4">
            <Pagination
              totalPageCount={totalPageCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default MangeProduct;
