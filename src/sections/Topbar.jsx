import { Link } from "react-router-dom"
import path from "~/constants/path"

function TopBar() {
  return (
    <div className="bg-main ">
        <div className="main-container flex justify-between text-white py-2">
            <span className="capitalize text-xs">ORDER ONLINE OR CALL US (+1800) 000 8808 </span>
            <Link to={path.LOGIN} className="text-xs hover:text-bl" >
                Sign In or Create Account
            </Link>
        </div>
    </div>
  )
}

export default TopBar
