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
      className="relative bg-white border border-gray-400 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
      onClick={() => {
        if (activeFilter === name) {
          setActiveFilter(null);
        } else {
          setActiveFilter(name);
        }
      }}
    >
      <div className="flex items-center p-3 cursor-pointer">
        <span className="capitalize text-sm">{title}</span>
        <RiArrowDropDownLine className="text-xl" />
      </div>

      {type === "input" && (
        <div
          className={`${
            activeFilter === name ? "block" : "hidden"
          } w-[348px] absolute z-10  rounded-md overflow-hidden bg-white border border-gray-300 left-[-1px] top-[calc(100%+4px)]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-[16px] py-3 border border-b-gray-400 text-sm">
            <p>Giá cao nhất là: {formatNumber(hightestPrice)}₫</p>
            <button
              className="cursor-pointer hover:text-main"
              onClick={() =>
                setFilterPrice({ ...filterPrice, "discountPrice[gte]": "", "discountPrice[lte]": "" })
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
                if (/^-?\d+$/.test(e.target.value)) {
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
