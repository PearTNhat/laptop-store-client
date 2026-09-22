import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { apiGetOrdersUser, apiUpdateStatusOrderProduct } from "~/apis/order";
import Pagination from "~/components/Pagination";
import { useDebounce } from "~/hook/useDebounce";
import { formatNumber } from "~/utils/helper";
import { orderStatus } from "~/constants/order";
import SelectItem from "~/components/SelectItem";
import { Toast } from "~/utils/alert";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiArrowRight,
  FiX,
} from "react-icons/fi";
import path from "~/constants/path";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "0", label: "Đang xử lý" },
  { value: "1", label: "Giao thành công" },
  { value: "-1", label: "Đã hủy" },
];

function Order() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [filter, setFilter] = useState({
    title: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const debounceSearch = useDebounce(filter.title, 500);

  const fetchOrderUser = async (params) => {
    setLoading(true);
    try {
      const response = await apiGetOrdersUser({ accessToken, params });
      if (response?.success) {
        const totalPage = Math.ceil(response.counts / 10) || 1;
        if (totalPage < currentPage) {
          setCurrentPage(currentPage - 1);
        }
        setOrders(response.data || []);
        setTotalPageCount(totalPage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handelCancelOrder = async ({ orderId, productId, title }) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận hủy đơn hàng?",
        text: `Bạn có chắc chắn muốn hủy sản phẩm "${title || "này"}" không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ee3131",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Đồng ý hủy",
        cancelButtonText: "Không",
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

  const renderStatusBadge = (statusCode) => {
    if (statusCode === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          <FiClock className="text-amber-500" />
          <span>{orderStatus[0] || "Đang xử lý"}</span>
        </span>
      );
    }
    if (statusCode === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <FiCheckCircle className="text-emerald-500" />
          <span>{orderStatus[1] || "Giao thành công"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
        <FiXCircle className="text-gray-400" />
        <span>{orderStatus[-1] || "Đã hủy"}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiPackage className="text-main text-2xl" />
            <span>Lịch sử đơn hàng</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi trạng thái các đơn hàng đã đặt và quản lý mua lại
          </p>
        </div>
        <span className="px-3 py-1 bg-red-50 text-main font-bold text-xs rounded-full border border-red-100 self-start sm:self-auto">
          {orders?.length || 0} đơn hàng
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={filter.title}
              onChange={(e) => {
                const val = e.target.value;
                setFilter((prev) => ({ ...prev, title: val }));
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-main focus:bg-white focus:ring-2 focus:ring-main/15 transition-all"
            />
            {filter.title && (
              <button
                onClick={() => setFilter((prev) => ({ ...prev, title: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-56 flex-shrink-0">
            <SelectItem
              placeholder="Trạng thái đơn hàng"
              isClearable
              options={statusOptions}
              onChange={(data) => {
                setFilter((prev) => ({ ...prev, status: data?.value || "" }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="animate-spin w-8 h-8 border-3 border-main border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-gray-500">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-50 text-main flex items-center justify-center text-3xl shadow-inner">
            <FiShoppingBag />
          </div>
          <h2 className="text-base font-bold text-gray-800">
            Không tìm thấy đơn hàng nào
          </h2>
          <p className="text-xs text-gray-500 max-w-sm">
            {filter.title || filter.status
              ? "Không có đơn hàng nào khớp với điều kiện tìm kiếm của bạn. Hãy thử thay đổi từ khóa."
              : "Bạn chưa đặt đơn hàng nào tại cửa hàng. Hãy chọn cho mình chiếc laptop ưng ý nhé!"}
          </p>
          <Link
            to={`/${path.PRODUCTS_CATEGORY}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-main hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all transform active:scale-98"
          >
            <span>Mua sắm ngay</span>
            <FiArrowRight className="text-sm" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderTotal = order.total ||
              order.products?.reduce((sum, p) => sum + (p.product?.discountPrice || 0) * p.quantity, 0);

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-gradient-to-r from-gray-50 via-slate-50/50 to-gray-50/80 px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-2xs">
                      Mã đơn: #{order._id?.slice(-8)?.toUpperCase()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {moment(order?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>

                  {order.address && (
                    <div className="text-gray-500 flex items-center gap-1.5 text-xs truncate max-w-md">
                      <FiMapPin className="text-main flex-shrink-0" />
                      <span className="truncate">{order.address}</span>
                    </div>
                  )}
                </div>

                {/* Products in this order */}
                <div className="divide-y divide-gray-100">
                  {order.products?.map((p, idx) => {
                    const color = p.product?.colors?.find(
                      (c) => c.color?.toLowerCase() === p.color?.toLowerCase()
                    );
                    const productPrice = p.product?.discountPrice || p.product?.price || 0;

                    return (
                      <div
                        key={p._id || idx}
                        className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        {/* Left: Thumbnail & Title */}
                        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                          <Link
                            to={`/${p.product?.slug}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1.5 flex items-center justify-center group"
                          >
                            <img
                              src={p.product?.primaryImage?.url}
                              alt={p.product?.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </Link>

                          <div className="space-y-1 min-w-0 flex-1">
                            <Link
                              to={`/${p.product?.slug}`}
                              className="font-bold text-sm text-gray-900 hover:text-main line-clamp-2 transition-colors"
                            >
                              {p.product?.title}
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-700">
                                Màu: {color?.color || p.color}
                              </span>
                              <span>•</span>
                              <span>Số lượng: <strong className="text-gray-800">{p.quantity}</strong></span>
                            </div>

                            <div className="text-xs text-gray-500 sm:hidden pt-1">
                              Đơn giá: <strong className="text-main">{formatNumber(productPrice)}₫</strong>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-gray-400 block">Đơn giá</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {formatNumber(productPrice)}₫
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {renderStatusBadge(p.status)}

                            {p.status === 0 && (
                              <button
                                onClick={() =>
                                  handelCancelOrder({
                                    orderId: order._id,
                                    productId: p.product?._id,
                                    title: p.product?.title,
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer Total */}
                <div className="bg-gray-50/50 px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    Tổng cộng {order.products?.length || 0} sản phẩm
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-600 font-medium">Thành tiền:</span>
                    <span className="text-base font-black text-main">
                      {formatNumber(orderTotal)}₫
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPageCount > 1 && (
        <div className="pt-2 pb-6 flex justify-center">
          <Pagination
            totalPageCount={totalPageCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Order;
