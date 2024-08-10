import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
function SelectOption({ Icon, to }) {
    return (
        <Link to={to} className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-white text-black hover:bg-black hover:text-white">
            <Icon />
        </Link>
    )
}

export default SelectOption