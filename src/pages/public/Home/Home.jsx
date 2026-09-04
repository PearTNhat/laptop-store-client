// import DailyDeals from "./component/DailyDeals"
import Featured from "./component/Featured";
import { bannerImages, logoImages } from "~/constants/images";
import ListProduct from "./component/ListProduct";
import CustomSliceStatic from "~/components/CustomSliceStatic";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Toast } from "~/utils/alert";
import { apiCheckStatusOrder } from "~/apis/order";
import Swal from "sweetalert2";
function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orderId } = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const checkStatusOrder = async (orderId) => {
    try {
      const res = await apiCheckStatusOrder({ orderId });
      if (res.data.resultCode == "0") {
        Swal.fire({
          icon: "success",
          title: "Mua hàng thành công",
        });
        navigate("/", { replace: true });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Mua hàng thất bại",
      });
      navigate("/", { replace: true });
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.message,
      });
    }
    navigate("/", { replace: true });
  };
  useEffect(() => {
    if (orderId) {
      checkStatusOrder(orderId);
    }
  }, [orderId]);
  return (
    <div className="main-container space-y-10 mb-12">
      {/* Banner */}
      <div className="w-full mt-4 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
        <CustomSliceStatic images={bannerImages} className="w-full" />
      </div>
      <div className="flex gap-6">
        {/* <DailyDeals /> */}
        <div className="flex-1 min-w-0">
          <ListProduct />
        </div>
      </div>
      <Featured />
      <div className="pt-8 pb-4 border-t border-gray-100">
        <div className="text-center mb-4">
          <span className="text-[11px] uppercase tracking-widest font-extrabold text-gray-400">
            Thương hiệu đối tác hàng đầu
          </span>
        </div>
        <CustomSliceStatic
          images={logoImages}
          className="w-full"
          options={{ slidesToShow: 5, autoplay: true, autoplaySpeed: 2000 }}
        />
      </div>
    </div>
  );
}

export default Home;
