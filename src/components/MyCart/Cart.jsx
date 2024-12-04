import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "~/utils/helper";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import path from "~/constants/path";
import { apiRemoveCartItem } from "~/apis/user";
import { Toast } from "~/utils/alert";
import { fetchCurrentUser } from "~/store/action/user";
function Cart() {
  const { userData,accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleDeleteItem = async ({product,color}) => {
    const response = await apiRemoveCartItem({accessToken, body: { product,color }});
    if(response?.success){
        Toast.fire({icon: 'success',title: 'Delete item successfully'})
        dispatch(fetchCurrentUser({ token: accessToken }));
    }else{
        Toast.fire({icon: 'error',title:'Fail to delete item'})
    }
  }
  return (
    <div className="max-w-[500px] min-w-[400px]">
        {userData?.carts?.length===0 && <p className="text-center">Chưa có sản phẩm trong giỏ hàng</p>}
        {userData?.carts?.length>0 && <ul className= ''>
        {userData?.carts?.map((item) => {
            const color = item.product?.colors?.find(
            (color) => color.color === item.color
            );
            return color && (
            <li key={item._id} className="flex mt-2 border border-gray-200 rounded-md p-1">
                <div className="w-[70px] pr-2">
                    <img src={color?.primaryImage.url} alt={color?.color} className="w-full" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <p className="line-clamp-2">{item.product?.title}</p> 
                    <p>×{item.quantity}</p>
                </div>
                <div className="flex items-center justify-between ">
                    <p>Color: {item.color}</p>
                    <p className=" font-semibold text-main">
                    {formatNumber(item.product.discountPrice * Number(item.quantity))} ₫
                    </p>
                </div>
                </div>
                <button className="p-4 flex items-center" onClick={()=>handleDeleteItem({product:item.product._id,color:item.color})}>
                <FaRegTrashAlt />
                </button>
            </li>
            );
        })}
        <div className="flex justify-end">
            <Link to={`${path.USER_CART}`} className=" bg-main text-white rounded-md px-3 py-2 mt-2">
                Xem chi tiết
            </Link>
        </div>
        </ul>}
    </div>
  );
}

export default Cart;
