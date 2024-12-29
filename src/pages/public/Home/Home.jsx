// import DailyDeals from "./component/DailyDeals"
import Featured from "./component/Featured";
import { bannerImages, logoImages } from "~/constants/images";
import ListProduct from "./component/ListProduct";
import SideBar from "./component/SideBar";
import CustomSliceStatic from "~/components/CustomSliceStatic";
import HotCollections from "./component/HotCollections";
import {  useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Toast } from "~/utils/alert";
import { apiCheckStatusOrder } from "~/apis/order";
import Swal from "sweetalert2";
function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {orderId} = useMemo(
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
        navigate('/',{replace:true});
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Mua hàng thất bại",
      });
      navigate('/',{replace:true});
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.message,
      });
    }
    navigate('/',{replace:true});
  };
  useEffect(() => {
    console.log(orderId);
    if (orderId) {
      console.log("zo");
      checkStatusOrder(orderId);
    }
  }, [orderId]);
  return (
    <div className="main-container">
      <div className="flex mt-3 gap-4">
        <SideBar />
        <CustomSliceStatic images={bannerImages} className={"flex-1 h-full"} />
      </div>
      <div className="flex">
        {/* <DailyDeals /> */}
        <ListProduct />
      </div>
      <Featured />
      <HotCollections />
      <CustomSliceStatic
        images={logoImages}
        className={""}
        options={{ slidesToShow: 5 }}
      />
    </div>
  );
}

export default Home;
