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
      <div
        ref={ref}
        className={`${
          activeFilter === name ? "block" : "hidden"
        } absolute z-10  rounded-md  bg-white border border-gray-300 top-[calc(100%+4px)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center gap-2 px-[16px] py-3 border border-b-gray-400 text-sm">
          <div className="flex gap-1">
            <span>Selected: </span>
            <span>{filter.length}</span>
          </div>
          <button
            className="cursor-pointer hover:text-main"
            onClick={() => setFilter({ ...filter, colors: [] })}
          >
            Reset
          </button>
        </div>
        {data.map((item) => (
          <div
            key={item.value}
            className="px-[16px] py-[5px] flex items-center gap-2 whitespace-nowrap"
          >
            <input
              type="checkbox"
              id={item.value}
              checked={filter[name]?.includes(item.value)}
              className="w-[20px] h-[20px] rounded-sm d-checkbox d-checkbox-info"
              onChange={(e) => {
                if (e.target.checked) {
                    setFilter((prev) => ({[name]: [...prev[name], item.value]}));
                } else {
                    setFilter({[name]:filter[name].filter((itm) => itm !== item.value)});
                }
              }}
            />
            <label className="cursor-pointer capitalize" htmlFor={item.value}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CheckBoxFilter);
