import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import path from "~/constants/path"

function TopBar() {
  const user = useSelector(state => state.user)
  useEffect(() => {
  }, [])
  return (
    <div className="bg-main ">
        <div className="main-container flex justify-between text-white py-2 text-xs">
            <span className="capitalize">ORDER ONLINE OR CALL US (+1800) 000 8808 </span>
            {
              user?.isLoggedIn ? (
                <span>Welcome {user.userData?.lastName}</span>
              )
              :
              <Link to={path.LOGIN} className=" hover:text-bl" >
                Sign In or Create Account
              </Link>
            }
           
        </div>
    </div>
  )
}0

export default TopBar
