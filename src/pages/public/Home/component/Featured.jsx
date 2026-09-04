import { useEffect, useState } from "react";
import { getAllProducts } from "~/apis/product";
import ProductCard from "./Product/ProductCard";
import SkeletonProductCard from "./Product/SkeletonProductCard";
import { FaStar } from "react-icons/fa";

function Featured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFeaturedProducts = async () => {
    const params = {
      limit: 9,
      totalRating: 5,
    };
    setLoading(true);
    try {
      const response = await getAllProducts({ params });
      setProducts(response.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 shadow-sm">
            <FaStar className="text-base" />
          </span>
          <h3 className="uppercase text-gray-900 text-xl font-extrabold tracking-wide">
            Sản phẩm nổi bật
          </h3>
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
            Featured Selection
          </span>
        </div>
      </div>

      {/* Grid with clear separation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonProductCard key={idx} className="p-3" />
            ))
          : products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
              />
            ))}
      </div>

      {/* Promotional Banners */}
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="w-full md:w-1/2 cursor-pointer overflow-hidden rounded-xl group shadow-sm">
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            alt="Banner 1"
          />
        </div>
        <div className="w-full md:w-1/4 flex flex-col gap-4 cursor-pointer">
          <div className="flex-1 overflow-hidden rounded-xl group shadow-sm">
            <img
              src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
              alt="Banner 2"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-xl group shadow-sm">
            <img
              src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
              alt="Banner 3"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 cursor-pointer overflow-hidden rounded-xl group shadow-sm">
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
            alt="Banner 4"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}

export default Featured;
