import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
function SelectOption({ Icon, to, className }) {
    let Comp = 'button'
    if (to) Comp = Link
    return (
        <Comp to={to} className={`${className} border border-gray-300 w-[40px] h-[40px] rounded-full flex justify-center items-center bg-white text-black hover:bg-with hover:text-main`}>
            <Icon />
        </Comp>
    )
}

export default SelectOption