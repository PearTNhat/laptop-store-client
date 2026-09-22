import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiHeart, FiArrowRight } from "react-icons/fi";
import Product from "~/pages/public/Home/component/Product/Product";
import path from "~/constants/path";

function WishList() {
  const { userData: { wishlist = [] } = {} } = useSelector(
    (state) => state.user
  );

  const validWishlist = wishlist?.filter((wl) => wl && wl.product) || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiHeart className="text-main text-2xl fill-main/20" />
            <span>Danh sách yêu thích</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Các dòng laptop bạn đã lưu lại để theo dõi giá và mua sắm sau
          </p>
        </div>
        <span className="px-3 py-1 bg-red-50 text-main font-bold text-xs rounded-full border border-red-100">
          {validWishlist.length} sản phẩm
        </span>
      </div>

      {/* Content */}
      {validWishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-rose-50 text-main flex items-center justify-center text-4xl shadow-inner">
            <FiHeart className="fill-main/20" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            Chưa có sản phẩm nào trong danh sách yêu thích
          </h2>
          <p className="text-xs text-gray-500 max-w-md">
            Hãy bấm vào biểu tượng trái tim trên các sản phẩm laptop bạn yêu thích để dễ dàng theo dõi và không bỏ lỡ chương trình khuyến mãi nhé!
          </p>
          <Link
            to={`/${path.PRODUCTS_CATEGORY}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-main hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all transform active:scale-98"
          >
            <span>Khám phá sản phẩm ngay</span>
            <FiArrowRight className="text-sm" />
          </Link>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {validWishlist.map((wl) => {
            const item = wl.product;
            if (!item) return null;
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <Product
                  pid={item._id}
                  price={item.price}
                  colors={item.colors}
                  discountPrice={item.discountPrice}
                  primaryImage={item.primaryImage?.url}
                  soldQuantity={item.soldQuantity}
                  title={item.title}
                  slug={item.slug}
                  totalRating={item.totalRating}
                  className="p-3"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishList;