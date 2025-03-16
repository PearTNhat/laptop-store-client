import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { apiGetOrdersUser, apiUpdateStatusOrderProduct } from "~/apis/order";
import InputField from "~/components/InputField";
import Pagination from "~/components/Pagination";
import { useDebounce } from "~/hook/useDebounce";
import { formatNumber } from "~/utils/helper";
import { orderStatus } from "~/constants/order";
import SelectItem from "~/components/SelectItem";
import { Toast } from "~/utils/alert";
import Swal from "sweetalert2";
const status = [
  { value: "-1", label: "Hủy đơn" },
  { value: "0", label: "Đang xử lý" },
  { value: "1", label: "Thành công" },
];
function Order() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [filter, setFilter] = useState({
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const debounceSearch = useDebounce(filter.title, 500);
  const fetchOrderUser = async (params) => {
    const response = await apiGetOrdersUser({ accessToken, params });
    if (response?.success) {
      const totalPage = Math.ceil(response.counts / 10) || 1;
      if (totalPage < currentPage) {
        setCurrentPage(currentPage - 1);
      }
      setOrders(response.data);
      setTotalPageCount(totalPage);
    }
  };
  const handelCancelOrder = async ({ orderId, productId }) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Đồng ý",
      });
      if (result.isDismissed) return;
      if (result.isConfirmed) {
        const res = await apiUpdateStatusOrderProduct({
          accessToken,
          orderId,
          productId,
          status: -1,
        });
  
        if (res.success) {
          Toast.fire({ icon: "success", title: "Hủy đơn hàng thành công" });
          fetchOrderUser(currentParams);
        } else {
          Toast.fire({ icon: "error", title: "Hủy đơn hàng thất bại" });
        }
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: error.message });
    }
  };
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      title: filter.title,
      status: filter.status,
    };
    fetchOrderUser(params);
  }, [currentParams]);
  useEffect(() => {
    setSearchParams({
      ...currentParams,
      page: currentPage,
      title: debounceSearch,
      status: filter.status || "",
    });
  }, [currentPage, debounceSearch, filter.status]);
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-gray-100 h-[60px]">
        <h1 className="text-2xl font-semibold p-3">Quản lý đơn hàng</h1>
      </div>
      <div className="">
        <form className="flex gap-3 justify-end px-2">
          <SelectItem
            placeholder="Trạng thái"
            isClearable
            isSearchable
            options={status}
            onChange={(data) => {
              setFilter((prev) => ({ ...prev, status: data?.value }));
            }}
          />
          <InputField
            type="text"
            cssDiv="!mb-0"
            placeholder={"Tìm kiếm tên sản phẩm"}
            className="px-4 py-[0.625rem] border-gray-300 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              let value = e.target.value;
              if (value.startsWith(" ")) {
                value = value.trim();
              }
              setFilter((prev) => ({ ...prev, title: value }));
            }}
          />
        </form>
      </div>
      <div className="p-2">
        <table className="w-full table-auto ">
          <thead>
            <tr className="border border-gray-300 bg-blue-900 text-white text-sm">
              <th className="p-2">#</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Số lượng</th>
              <th className="p-2">Giá</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              let totalMoney = order.total;
              if (filter.title || filter.status) {
                totalMoney = order.products?.reduce((total, p) => {
                  return total + p.product.discountPrice * p.quantity;
                }, 0);
              }
              return (
                <Fragment key={order._id}>
                  <tr className="font-semibold text-blue-500">
                    <td colSpan="6" className="p-2 ">
                      <p>
                        <span className="inline-block mr-3">
                          Ngày:{" "}
                          {moment(order?.createdAt).format("DD/MM/YYYY HH:mm")}
                        </span>
                        <span className="text-black">
                          Địa chỉ: {order?.address}
                        </span>
                      </p>
                    </td>
                  </tr>
                  <>
                    {order.products.map((p, idx) => {
                      const color = p.product.colors.find(
                        (color) =>
                          color.color.toLowerCase() === p.color.toLowerCase()
                      );
                      return (
                        <tr key={p._id} className="border border-gray-300 ">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">
                            <Link to={`/${p.product.slug}`}>
                              <img
                                src={p.product.primaryImage.url}
                                className="w-[100px]"
                                alt=""
                              />
                            </Link>
                          </td>
                          <td className="p-2">
                            {p.product.title} - {color.color}
                          </td>
                          <td className="p-2 text-center">{p.quantity}</td>
                          <td className="p-2">
                            {formatNumber(p.product.discountPrice)}đ
                          </td>
                          <td className="p-2">
                            <span
                              className={`${
                                p.status === 0
                                  ? " text-yellow-600 bg-yellow-100"
                                  : p.status === -1
                                  ? "text-orange-600 bg-orange-100"
                                  : "text-green-600 bg-green-100"
                              } py-1 px-2 rounded-md text-xs`}
                            >
                              {orderStatus[p.status]}
                            </span>
                          </td>
                          <td className="p-2">
                            <button
                              className={`text-red-400 underline hover:text-red-500 text-center w-full ${
                                p.status == -1 && "hidden"
                              }`}
                              onClick={() =>
                                handelCancelOrder({
                                  orderId: order._id,
                                  productId: p.product._id,
                                })
                              }
                            >
                              Hủy đơn
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                  <tr>
                    <td colSpan="7" className="border border-gray-300 p-2">
                      <span className="font-semibold">Tổng cộng:</span>{" "}
                      <span className="text-main">
                        {formatNumber(totalMoney)}đ
                      </span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 mb-6">
        <Pagination
          totalPageCount={totalPageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Order;
