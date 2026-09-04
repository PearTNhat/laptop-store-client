/* eslint-disable react/prop-types */
import { memo, useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import {  useSearchParams } from "react-router-dom";
function CheckBoxFilter({ data, name,title,currentParams }) {
  const ref = useRef();
  const [ ,setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(null);
  const [filter, setFilter] = useState({
    [name]: currentParams[name]?.split(",") || [],
  });
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setActiveFilter(null);
    }
  };
  useEffect(() => {
    if (name !== activeFilter) return;
    const search = { ...currentParams };
    if (filter[name]?.length) {
      search[name] = filter[name].join(",");
    } else {
      delete search[name];
    }
    setSearchParams(search)
    // cần dependency activeFilter để chọn vào cái nào thì search ngay cái đó
  }, [filter, activeFilter]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
      {
        filter[name].length > 0 &&
        <span className="absolute bg-main top-[-5px] right-[-5px] text-white w-[18px] h-[18px] rounded-full flex justify-center items-center text-[10px] shadow-sm font-semibold">
        {filter[name].length}
      </span>
      }
      <div className="flex items-center px-4 py-2 cursor-pointer gap-2">
        <span className="capitalize text-sm text-gray-700 font-medium">{title}</span>
        <RiArrowDropDownLine className={`text-xl text-gray-500 transition-transform duration-300 ${activeFilter === name ? 'rotate-180' : ''}`} />
      </div>
      <div
        ref={ref}
        className={`${
          activeFilter === name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
        } absolute z-50 rounded-xl bg-white shadow-xl border border-gray-100 top-[calc(100%+8px)] w-max min-w-[200px] transition-all duration-300 left-0 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm">
          <div className="flex gap-1">
            <span>Selected: </span>
            <span>{filter[name].length}</span>
          </div>
          <button
            className="cursor-pointer hover:text-main"
            onClick={() => setFilter({ ...filter, [name]: [] })}
          >
            Reset
          </button>
        </div>
        {data.map((item) => (
          <div
            key={item.value}
            className="px-4 py-2.5 flex items-center gap-3 whitespace-nowrap hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              id={item.value}
              checked={filter[name]?.includes(item.value)}
              className="w-5 h-5 rounded d-checkbox d-checkbox-error border-gray-300"
              onChange={(e) => {
                if (e.target.checked) {
                    setFilter((prev) => ({[name]: [...prev[name], item.value]}));
                } else {
                    setFilter({[name]:filter[name].filter((itm) => itm !== item.value)});
                }
              }}
            />
            <label className="cursor-pointer capitalize text-gray-700 w-full" htmlFor={item.value}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CheckBoxFilter);
