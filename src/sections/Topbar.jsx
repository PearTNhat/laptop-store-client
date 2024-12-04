import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import path from "~/constants/path"
import { fetchCurrentUser } from "~/store/action/user"

function TopBar() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!user.accessToken) return
    dispatch(fetchCurrentUser({token: user.accessToken}))
  }, [user.accessToken])
  return (
    <div className="bg-main ">
        <div className="main-container flex justify-between text-white py-2 text-xs">
            <span className="capitalize">ORDER ONLINE OR CALL US (+1800) 000 8808 </span>
            {
             user.accessToken ? (
                <span>Welcome {user.userData?.lastName}</span>
              )
              :
              <Link to={path.LOGIN} className=" hover:text-bl" >
                Đăng nhập hoặc tạo tài khoản
              </Link>
            }
           
        </div>
    </div>
  )
}0

export default TopBar
