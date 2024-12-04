import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "~/apis/product";
import Breadcrumbs from "~/components/Breadcrumbs";
import Product from "../Home/component/Product/Product";
import InputOrCheckBoxFilter from "~/components/Filter/InputOrCheckBoxFilter";
import SelectionFilter from "~/components/Filter/SelectionFilter";
import Pagination from "~/components/Pagination";
import { AiIcon } from "~/assets/images";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "~/store/slice/app";
import DescriptionModal from "./component/DescriptionModal";
import { fetchBrands } from "~/store/action/brand";
import CheckBoxFilter from "~/components/Filter/CheckBoxFilter";
const colors = [
  { value: "Titan Đen", label: "Titan Đen" },
  { value: "Titan Trắng", label: "Titan Trắng" },
  { value: "Titan Xanh", label: "Titan Xanh" },
  { value: "Titan tự nhiên", label: "Titan tự nhiên" },
];
const rams = [
  { value: "8GB", label: "8GB" },
  { value: "16GB", label: "16GB" },
  { value: "32GB", label: "32GB" },
  { value: "64GB", label: "64GB" },
];
const LIMIT = 10;
function ProductCategory() {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brand);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const fetchProductCategory = async (filter) => {
    const params = { ...filter };
    const response = await getAllProducts({ params });
    const totalPage = Math.ceil(response.counts / 10) || 1;
    if (response.success) {
      setProducts(response.data);
      setTotalPageCount(totalPage);
    }
  };
  const handleSmartSearch = () => {
    dispatch(
      appActions.toggleModal({
        isShowModal: true,
        childrenModal: <DescriptionModal />,
      })
    );
  };
  console.log(brands);
  useEffect(() => {
    fetchProductCategory(currentParams);
  }, [currentParams]);
  useEffect(() => {
    setSearchParams({ ...currentParams, page: currentPage, limit: LIMIT });
  }, [currentPage]);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchBrands());
  }, []);
  return (
    <div className="my-8">
      <div className="bg-[#f7f7f7]">
        <div className="py-2 mb-8 main-container">
          <h3 className="uppercase text-xl font-semibold text-black">
            Danh sách sản phẩm
          </h3>
          <Breadcrumbs />
        </div>
      </div>
      <div className="main-container">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2">
            <div className="">
              <p className="font-semibold">Lọc theo</p>
              <div className="flex gap-2 my-4">
                <InputOrCheckBoxFilter
                  title="Giá"
                  name="price"
                  type="input"
                  currentParams={currentParams}
                />
                <CheckBoxFilter
                  currentParams={currentParams}
                  title="Màu sắc"
                  name="color"
                  data={colors}
                />
                <CheckBoxFilter
                  currentParams={currentParams}
                  title="Ram"
                  name="ram"
                  data={rams}
                />
                {/* <InputOrCheckBoxFilter
                  title="Thương hiệu"
                  name="color"
                  data={colors}
                /> */}
              </div>
            </div>
            <div className="">
              <p className="font-semibold">Sắp xếp</p>
              <div className="w-[200px] my-4">
                <SelectionFilter currentParams={currentParams} />
              </div>
            </div>
          </div>
          <button
            className="flex gap-3 items-center bg-red-500 p-2 rounded-md text-white"
            onClick={handleSmartSearch}
          >
            <i>
              <img src={AiIcon} className="w-[30px] h-[30px]" alt="" />
            </i>
            Tìm kiếm theo mô tả
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {products.length === 0 && (
            <p className="text-center text-2xl w-full">
              Không tìm thấy sản phẩm
            </p>
          )}
          {products.map((product) => (
            <Product
              key={product._id}
              pid={product._id}
              price={product.price}
              discountPrice={product.discountPrice}
              primaryImage={product.primaryImage.url}
              title={product.title}
              slug={product.slug}
              colors={product.colors}
              totalRating={product.totalRating}
              soldQuantity={product.soldQuantity}
              className="p-3 w-[calc(25%-9px)] max-md:w-[calc(50%-6px)] max-lg:w-[calc(33.3333%-8px)]"
            />
          ))}
        </div>
        <div className="mt-6">
          <Pagination
            siblingCount={1}
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCategory;
