import { memo } from "react";

/* eslint-disable react/prop-types */
function QuantityInput({quantity,setQuantity,onUp=null, onDown=null,maxQuantity=100000}) {
  const onUpFunc = onUp || (() => setQuantity((prev) => prev + 1));
  const onDownFunc = onDown || (() => setQuantity((prev) => prev - 1));
  return (
    <div className="flex items-center justify-between w-[100px]  border border-gray-300 rounded-md">
      <button
        disabled={quantity <= 1}
        className={`${quantity <= 1? 'cursor-not-allowed':'cursor-pointer'} w-[32px] h-9 flex items-center justify-center border-r border-gray-300`}
        onClick={() => {
          if(quantity > 1){
            onDownFunc()
          }
        }}
      >
        -
      </button>
      <input
        type="text"
        className="w-[36px] h-9 text-center outline-none"
        value={quantity}
        onChange={(e) => {
          if(/^-?\d+$/.test(e.target.value)){
            setQuantity(e.target.value)
          }
        }}
      />
      <button
        className={`${quantity >= maxQuantity? 'cursor-not-allowed':'cursor-pointer'} w-[32px] h-9 flex items-center justify-center border-l border-gray-300`}
        onClick={() => {
          if(quantity < maxQuantity){
              onUpFunc()
          }
        }}
      >
        +
      </button>
    </div>
  );
}

export default memo(QuantityInput);
