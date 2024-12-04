import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "~/apis/product";
import CustomSliceProducts from "~/components/CustomSliceProducts";
import { fetchNewProduct } from "~/store/action/product";
function ListProduct() {
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => {
    return state.products;
  });
  const [bestSeller, setBestSeller] = useState([]);
  const fetchProduct = async () => {
    const response = await getAllProducts({
      params: { sort: "-soldQuantity" },
    });
    if (response?.success) setBestSeller(response.data);
  };
  useEffect(() => {
    fetchProduct();
    dispatch(fetchNewProduct());
  }, []);
  return (
    <div className="ml-3 flex-1 overflow-hidden">
      <div className="">
        <h3 className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold">
          Sản phẩm bán chạy nhất
        </h3>
        <CustomSliceProducts products={bestSeller} isTrending/>
      </div>
      <div className="">
        <h3 className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold">
          Sản phẩm mới về
        </h3>
        <CustomSliceProducts products={newProducts} isNew />
      </div>
    </div>
  );
}

export default ListProduct;
