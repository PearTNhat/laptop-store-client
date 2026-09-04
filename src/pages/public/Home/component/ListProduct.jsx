import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "~/apis/product";
import CustomSliceProducts from "~/components/CustomSliceProducts";
import { fetchNewProduct } from "~/store/action/product";
import { FaFire } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

function ListProduct() {
  const dispatch = useDispatch();
  const [loadingBestSeller, setLoadingBestSeller] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [bestSeller, setBestSeller] = useState([]);
  const [localNewProducts, setLocalNewProducts] = useState([]);

  const { newProducts, isLoading: reduxNewLoading } = useSelector((state) => {
    return state.products;
  });

  const fetchBestSeller = async () => {
    try {
      setLoadingBestSeller(true);
      const response = await getAllProducts({
        params: { sort: "-soldQuantity", limit: 8 },
      });
      if (response?.success && Array.isArray(response.data)) {
        setBestSeller(response.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBestSeller(false);
    }
  };

  const fetchDirectNew = async () => {
    try {
      setLoadingNew(true);
      const response = await getAllProducts({
        params: { sort: "-createdAt", limit: 8 },
      });
      if (response?.success && Array.isArray(response.data)) {
        setLocalNewProducts(response.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNew(false);
    }
  };

  useEffect(() => {
    fetchBestSeller();
    fetchDirectNew();
    dispatch(fetchNewProduct());
  }, []);

  const displayNewProducts =
    newProducts && newProducts.length > 0 ? newProducts : localNewProducts;
  const isNewLoading =
    (loadingNew || reduxNewLoading) && displayNewProducts.length === 0;

  return (
    <div className="flex-1 overflow-hidden flex flex-col gap-10">
      {/* Best Seller Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 shadow-sm">
              <FaFire className="text-lg animate-pulse" />
            </span>
            <h3 className="uppercase text-gray-900 text-xl font-extrabold tracking-wide">
              Sản phẩm bán chạy nhất
            </h3>
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
              Trending Deals
            </span>
          </div>
        </div>
        <CustomSliceProducts
          products={bestSeller}
          isTrending
          loading={loadingBestSeller}
        />
      </div>

      {/* New Arrivals Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 shadow-sm">
              <HiSparkles className="text-lg" />
            </span>
            <h3 className="uppercase text-gray-900 text-xl font-extrabold tracking-wide">
              Sản phẩm mới về
            </h3>
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
              New Arrivals
            </span>
          </div>
        </div>
        <CustomSliceProducts
          products={displayNewProducts}
          isNew
          loading={isNewLoading}
        />
      </div>
    </div>
  );
}

export default ListProduct;
