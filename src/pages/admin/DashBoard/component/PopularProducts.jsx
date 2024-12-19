import classNames from "classnames";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "~/apis/product";
import { formatNumber } from "~/utils/helper";

function PopularProducts() {
  const [bestSeller, setBestSeller] = useState([]);

  const fetchBestSellter = async () => {
    const response = await getAllProducts({
      params: { sort: "-soldQuantity",limit:5 },
    });
    if (response?.success) setBestSeller(response.data);
  };
  useEffect(() => {
    fetchBestSellter();
  }, []);
  return (
    <div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
      <strong className="text-gray-700 font-medium">Popular Products</strong>
      <div className="mt-4 flex flex-col gap-3">
        {bestSeller?.map((product) => (
          <Link
            key={product._id}
            to={`/${product.slug}`}
            className="flex items-start hover:no-underline"
          >
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
              <img
                className="w-full h-full object-cover rounded-sm"
                src={product.primaryImage.url}
                alt={product.title}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-800 line-clamp-2">{product.title}</p>
              <span
                className={classNames(
                  product.quantity === 0
                    ? "text-red-500"
                    : product.quantity > 50
                    ? "text-green-500"
                    : "text-orange-500",
                  "text-xs font-medium"
                )}
              >
                {product.quantity === 0
                  ? "Hết hàng"
                  : "Còn " + product.quantity + " sản phẩm"}
              </span>
            </div>
            <div className="text-xs text-gray-400 pl-1.5">
              {formatNumber(product.discountPrice)  }đ
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularProducts;
