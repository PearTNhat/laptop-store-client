import { useState } from "react";
import { otherInfoProduct } from "~/constants/product";

function OtherInfoProduct() {
  const [activeTab, setActiveTab] = useState(otherInfoProduct[0]);
  return (
    <div className="w-full">
      <ul className=" flex gap-1">
        {otherInfoProduct.map((info) => (
          <li
            key={info.id}
            className={`uppercase border border-gray-200 p-2 relative bg-white top-[1px] cursor-pointer ${activeTab.id !== info.id
                ? "!text-gray-600  !bg-gray-100"
                : " border-b-white z-10"
              } `}
            onClick={() => setActiveTab(info)}
          >
            {info.title}
          </li>
        ))}
      </ul>
      <p className="border border-gray-300 text-gray-600 p-3">
        {activeTab.content}
      </p>
    </div>
  );
}

export default OtherInfoProduct;
