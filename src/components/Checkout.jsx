import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Logo, payment } from "~/assets/images";
import { formatNumber } from "~/utils/helper";

function Checkout() {
  const {
    userData: { carts },
  } = useSelector((state) => state.user);
  return (
    <div className="grid grid-cols-10 p-4 h-screen auto-rows-min">
      <div className="col-span-10 h-[40px] flex ">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="md:col-span-3 max-md:hidden flex justify-center items-center">
        <img src={payment} alt="" />
      </div>
      <div className="col-span-7">
        <table className="table-auto">
          <thead className="bg-gray-300">
            <th className="p-2 text-left">Image</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-right">Price</th>
          </thead>
          <tbody className="border border-gray-300">
            {carts?.map((cart) => {
              const color = cart.product.colors.find(
                (color) => color.color === cart.color
              );
              return (
                <tr key={cart._id} className="border-b border-b-gray-300">
                  <td className="p-2">
                    <img src={color.primaryImage.url} alt="" />
                  </td>
                  <td className="p-2 line-clamp-2" title={cart.product.title}>{cart.product.title}</td>
                  <td className="p-2">{cart.color}</td>
                  <td className="p-2">{cart.quantity}</td>
                  <td className="text-right p-2">{formatNumber( cart.product.discountPrice)}₫</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end mt-2 gap-2">
        <span className="font-semibold">
          Total: 
        </span>
        <span className="text-main">
          {formatNumber(carts.reduce((acc, cart) => acc + cart.product.discountPrice * cart.quantity, 0))}₫
        </span>
      </div>
      </div>
    </div>
  );
}

export default Checkout;
