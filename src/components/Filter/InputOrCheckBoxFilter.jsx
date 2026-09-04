/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, memo } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  useSearchParams,
} from "react-router-dom";
import InputField from "~/components/InputField";
import { covertMoneyToNumber, formatNumber } from "~/utils/helper";
import { useDebounce } from "~/hook/useDebounce";
import { getAllProducts } from "~/apis/product";
// let firstRender = true
function InputOrCheckBoxFilter({ title, name, type = "checkbox" ,currentParams}) {
  const ref = useRef();
  const [activeFilter, setActiveFilter] = useState("");
  const [hightestPrice, setHightestPrice] = useState(0);
  const [,setSearchParams] = useSearchParams();
  const [filterPrice, setFilterPrice] = useState({
    "price[gte]": currentParams["price[gte]"] || "0",
    "price[lte]": currentParams["price[lte]"] || "0",
  });
  // cái giá trị mặc định chỉ lấy khi lần mount đầu tiên

  const priceDebouncing = useDebounce(filterPrice, 1000);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setActiveFilter(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // lấy giá cao nhất
  useEffect(() => {
    const fetchHighestPrice = async () => {
      const response = await getAllProducts({
        params: { sort: "-discountPrice", limit: 1 },
      });
      if (response.success) {
        setHightestPrice(response.data[0]?.discountPrice);
        setFilterPrice({...filterPrice,"discountPrice[lte]":response.data[0]?.discountPrice})
      }
    };
    fetchHighestPrice();
  }, []);
  // sử lý debouncing cho giá

  // sử lý filter nhiều thứ
  useEffect(() => {
    if (name !== activeFilter) return;
    const search = { ...currentParams };
    if (filterPrice["discountPrice[gte]"]) {
      search["discountPrice[gte]"] = filterPrice["discountPrice[gte]"];
    }
    if (filterPrice["discountPrice[lte]"]) {
      search["discountPrice[lte]"] = filterPrice["discountPrice[lte]"];
    }
    setSearchParams(search);
    // cần dependency activeFilter để chọn vào cái nào thì search ngay cái đó
  }, [priceDebouncing, activeFilter]);
  return (
    <div
      ref={ref}
      className="relative bg-white border border-gray-200 rounded-lg hover:border-main hover:shadow-md transition-all duration-300"
      onClick={() => {
        if (activeFilter === name) {
          setActiveFilter(null);
        } else {
          setActiveFilter(name);
        }
      }}
    >
      <div className="flex items-center px-4 py-2 cursor-pointer gap-2">
        <span className="capitalize text-sm text-gray-700 font-medium">{title}</span>
        <RiArrowDropDownLine className={`text-xl text-gray-500 transition-transform duration-300 ${activeFilter === name ? 'rotate-180' : ''}`} />
      </div>

      {type === "input" && (
        <div
          className={`${
            activeFilter === name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
          } w-[348px] absolute z-50 rounded-xl overflow-hidden bg-white shadow-xl border border-gray-100 left-0 top-[calc(100%+8px)] transition-all duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm">
            <p className="font-medium text-gray-700">Giá cao nhất là: {formatNumber(hightestPrice)}₫</p>
            <button
              className="cursor-pointer hover:text-main"
              onClick={() =>
                setFilterPrice({ ...filterPrice, "discountPrice[gte]": "", "discountPrice[lte]": hightestPrice })
              }
            >
              Reset
            </button>
          </div>
          <div className="flex gap-3 py-[16px]  px-[16px] ">
            <InputField
              placeholder={"Từ"}
              value={formatNumber(Number(filterPrice["discountPrice[gte]"])) || 0}
              nameKey={"discountPrice[gte]"}
              onChange={(e) => {
                if (/^-?\d+$/.test(covertMoneyToNumber(e.target.value))) {
                  setFilterPrice({
                    ...filterPrice,
                    "discountPrice[gte]": covertMoneyToNumber(e.target.value),
                  });
                }
              }}
            />
            <InputField
              placeholder={"Đến"}
              value={formatNumber(Number(filterPrice["discountPrice[lte]"])) || ""}
              nameKey={"discountPrice[lte]"}
              onChange={(e) => {
                if (/^-?\d+$/.test(covertMoneyToNumber(e.target.value))) {
                  setFilterPrice({
                    ...filterPrice,
                    "discountPrice[lte]": covertMoneyToNumber(e.target.value),
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(InputOrCheckBoxFilter);
