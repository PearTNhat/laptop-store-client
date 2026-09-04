/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { DefaultProduct } from "~/assets/images";
import PriceStartProduct from "~/components/PriceStartProduct";
import path from "~/constants/path";

function ProductCard({ product, className = "" }) {
  return (
    <div
      className={
        "w-full bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 p-3 flex items-center gap-3 group " +
        className
      }
    >
      <div className="w-[32%] flex-shrink-0 bg-gray-50/70 rounded-lg p-2 flex items-center justify-center overflow-hidden">
        <Link to={`${path.PUBLIC}${product.slug}`} className="block w-full">
          <img
            src={product.primaryImage?.url || DefaultProduct}
            alt={product.title}
            className="w-full h-24 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="flex-1 min-w-0">
        <PriceStartProduct
          price={product.price}
          discountPrice={product.discountPrice}
          soldQuantity={product.soldQuantity}
          title={product.title}
          slug={product.slug}
          to={`${path.PUBLIC}${product.slug}`}
          totalRating={product.totalRating}
        />
      </div>
    </div>
  );
}

export default ProductCard;