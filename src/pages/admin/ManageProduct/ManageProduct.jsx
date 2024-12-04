/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SelectItem from "~/components/SelectItem";
import { getAllProducts } from "~/apis/product";
import InputField from "~/components/InputField";
import Pagination from "~/components/Pagination";
import { useDebounce } from "~/hook/useDebounce";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
const tableHeaderTitleList = [
  "#",
  "Ảnh",
  "Tên",
  "Thương hiệu",
  "Series",
  "Giá",
  "Số lượng",
  "Đã bán",
  "Đánh giá",
  "Ngày tạo",
  "Chức năng",
];
function MangeProduct() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [filter, setFilter] = useState({
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const fetchAllProduct = async (params) => {
    const response = await getAllProducts({
      params: { ...params, showAll: true },
    });
    if (response.success) {
      const totalPage = Math.ceil(response.counts / 10);
      if (totalPage < currentPage) {
        setCurrentPage(currentPage - 1);
      }
      setTotalPageCount(totalPage);
      setProducts(response.data);
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
  const debounceSearch = useDebounce(filter.title, 500);
  useEffect(() => {
    // chay lan dau tien
    fetchAllProduct({ page: 1, limit: 10 });
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
    fetchAllProduct({ ...params, ...search });
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
      <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
      <div className="">
        <div className="flex justify-end mr-4">
          <form className="flex gap-3">
            <SelectItem
              className="z-50"
              isClearable
              isSearchable
              placeholder="Chọn thương hiệu"
              options={[
                { value: "8GB", label: "8GB" },
                { value: "16GB", label: "16GB" },
                { value: "32GB", label: "32GB" },
                { value: "64GB", label: "64GB" },
              ]}
              onChange={(data) => {
                // setFilter((prev) => ({ ...prev, status: data?.value }));
              }}
            />
            <SelectItem
              className="z-50"
              isClearable
              isSearchable
              placeholder="Chọn series"
              options={[
                { value: "8GB", label: "8GB" },
                { value: "16GB", label: "16GB" },
                { value: "32GB", label: "32GB" },
                { value: "64GB", label: "64GB" },
              ]}
              onChange={(data) => {
                // setFilter((prev) => ({ ...prev, status: data?.value }));
              }}
            />
            <InputField
              type="text"
              placeholder={"Tìm kiếm tên sản phẩm"}
              className="px-4 py-[0.625rem] border-gray-200 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        <div className="py-4">
          <div className="shadow">
            <table className="w-full">
              <thead className="">
                <tr className="border-gray-200 border-y bg-blue-900 text-white">
                  {tableHeaderTitleList.map((title) => (
                    <th key={title} className="text-left px-1 py-2" scope="col">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products?.map((p, index) => {
                  const isSelected = selectedProduct.some(
                    (item) => item === p._id
                  );
                  return (
                    <Fragment key={p._id}>
                      <tr
                        onClick={() => handleRowClick(p)}
                        className="cursor-pointer"
                      >
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>
                        <td className="p-4 gap-2 border-gray-200 border-b text-sm">
                          <div className="flex gap-3 items-center justify-start">
                            <div className="w-10 h-10 rounded-md  overflow-hidden">
                              <img
                                className="object-cover object-center w-full h-full"
                                src={`${p.primaryImage?.url}`}
                                alt={p.title}
                              />
                            </div>
                          </div>
                        </td>
                        <td
                          className="p-1 border-gray-200 border-b text-sm max-w-[200px]"
                          title={p.title}
                        >
                          <p className="line-clamp-2">{p.title}</p>
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.brand}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.series}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.discountPrice}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.quantity}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.soldQuantity}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          {p.totalRating}
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          <p>
                            {moment(p.createdAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </td>
                        <td className="p-1 border-gray-200 border-b text-sm">
                          <div className="flex items-center justify-center text-[16px]">
                            <Link
                              className={`mr-3 text-yellow-400 hover:text-yellow-600 hover:underline`}
                              to={`/admin/manage/products/edit/${p.slug}`}
                            >
                              <FaRegEdit />
                            </Link>
                            <Link
                              className="mr-3 text-green-400 hover:text-green-900 disabled:opacity-70  hover:underline`}"
                              to={`/admin/manage/products/create-color/${p.slug}`}
                            >
                              <IoMdAddCircleOutline />
                            </Link>
                            <Link
                              className=" text-red-600 hover:text-red-900 disabled:opacity-70  hover:underline`}"
                              to={`/admin/manage/products/delete/${p.slug}`}
                            >
                              <FaRegTrashAlt />
                            </Link>
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
                                    Màu sắc
                                  </th>
                                  <th className="p-2 border-gray-200 border-b text-sm">
                                    Ảnh
                                  </th>
                                  <th className="p-2 border-gray-200 border-b text-sm">
                                    Số lượng
                                  </th>
                                  <th className="p-2 border-gray-200 border-b text-sm">
                                    Đã bán
                                  </th>
                                  <th className="p-2 border-gray-200 border-b text-sm">
                                    Chức năng
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.colors?.map((color, idx) => (
                                  <tr key={idx}>
                                    <td className="p-2 border-gray-200 border-b text-sm">
                                      {idx + 1}
                                    </td>
                                    <td className="p-2 border-gray-200 border-b text-sm">
                                      {color.color}
                                    </td>
                                    <td className="p-2 border-gray-200 border-b text-sm">
                                      <div className="w-10 h-10 rounded-md overflow-hidden">
                                        <img
                                          className="object-cover object-center w-full h-full"
                                          src={color.primaryImage.url}
                                          alt={color.color}
                                        />
                                      </div>
                                    </td>
                                    <td className="p-2 border-gray-200 border-b text-sm">
                                      {color.quantity}
                                    </td>
                                    <td className="p-2 border-gray-200 border-b text-sm">
                                      {color.soldQuantity}
                                    </td>
                                    <td>
                                      <div className="flex items-center text-[16px]">
                                        <Link
                                          className={`mr-3 text-yellow-400 hover:text-yellow-600 hover:underline`}
                                          to={`/admin/manage/products/edit-color/${p.slug}/${color._id}`}
                                        >
                                          <FaRegEdit />
                                        </Link>
                                        <Link
                                          className=" text-red-600 hover:text-red-900 disabled:opacity-70  hover:underline`}"
                                          to={`/admin/manage/products/delete-color/${p.slug}`}
                                        >
                                          <FaRegTrashAlt />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
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
      </div>
    </div>
  );
}

export default MangeProduct;
