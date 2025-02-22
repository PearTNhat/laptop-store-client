/* eslint-disable react/prop-types */
function CountDown({text, number}) {
  return (
    <div className="bg-[#f4f4f4] flex flex-col items-center justify-center w-[60px] h-[60px]">
        <span className="font-semibold text-[18px]">{number.toString().length == 1 ? '0' +number : number }</span>
        <span className="text-[12px] text-[#8b8b8b]">{text}</span>
    </div>
  )
}

export default CountDown