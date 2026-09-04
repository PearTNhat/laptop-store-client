/* eslint-disable react/prop-types */
import path from "~/constants/path";
import { BsFillCartPlusFill } from "react-icons/bs";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { DefaultProduct } from "~/assets/images";
import { FaHeart } from "react-icons/fa";
import SelectOption from "~/components/SelectOption";
import PriceStartProduct from "~/components/PriceStartProduct";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateCart, apiUpdateWishlist } from "~/apis/user";
import { fetchCurrentUser } from "~/store/action/user";
import { Toast } from "~/utils/alert";
import Swal from "sweetalert2";
function Product({
  className,
  pid,
  soldQuantity,
  colors,
  price,
  discountPrice,
  primaryImage,
  title,
  slug,
  totalRating,
  isNew,
  isTrending,
  onClickLink,
}) {
  const {
    userData: { wishlist, carts },
    accessToken,
  } = useSelector((state) => {
    return state.user;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLiked = wishlist?.some((item) => item.product?._id === pid);
  const isExistInCart = carts?.some((item) => item.product?._id === pid);

  const discountPercent =
    price && discountPrice && Number(price) > Number(discountPrice)
      ? Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100)
      : 0;

  const handleAddWishList = async (e) => {
    e.stopPropagation();
    if (!accessToken) {
      Swal.fire({
        title: "Oops!",
        text: "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích",
        icon: "info",
        cancelButtonText: "Hủy",
        showCancelButton: true,
        confirmButtonText: "Tới đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    try {
      const res = await apiUpdateWishlist({ accessToken, product: pid });
      if (res?.success) {
        Toast.fire({
          icon: "success",
          title: `${
            isLiked ? "Xóa sản phẩm trong" : "Thêm sản phẩm vào"
          } danh sách yêu thích thành công `,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Thêm vào danh sách yêu thích thất bại",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Thêm vào danh sách yêu thích thất bại",
      });
    }
    dispatch(fetchCurrentUser({ token: accessToken }));
  };
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!accessToken) {
      Swal.fire({
        title: "Oops!",
        text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        icon: "info",
        cancelButtonText: "Hủy",
        showCancelButton: true,
        confirmButtonText: "Tới đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    let color;
    for (let i = 0; i < colors.length; i++) {
      if (colors[i].primaryImage.url === primaryImage.url) {
        color = colors[i].color;
        break;
      }
    }
    if (!color) color = colors[0].color;
    const body = {
      product: pid,
      color,
      quantity: 1,
    };
    const response = await apiUpdateCart({ accessToken, body });
    if (response?.success) {
      Toast.fire({
        icon: "success",
        title: "Thêm vào giỏ hàng thành công",
      });
      dispatch(fetchCurrentUser({ token: accessToken }));
    } else {
      Toast.fire({
        icon: "error",
        title: "Thêm vào giỏ hàng thất bại",
      });
    }
  };
  return (
    <div
      className={
        "rounded-xl border border-gray-100 cursor-pointer group hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 bg-white " + className
      }
    >
      <div className="mb-3 relative rounded-t-xl">
        <Link
          to={`${path.PUBLIC}${slug}`}
          className="block overflow-hidden rounded-t-xl"
          onClick={onClickLink}
        >
          <div className="css-w-img">
            <div className="css-img-item">
              <img
                src={primaryImage || DefaultProduct}
                alt={title}
                className="m-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </Link>

        {/* High-Contrast Crisp Badges (Never Clipped, Super Clear) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div>
            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#e11b1b] text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded shadow-sm">
                <span>⚡ -{discountPercent}%</span>
              </span>
            )}
          </div>
          <div>
            {isTrending && (
              <span className="inline-flex items-center gap-1 bg-[#ea580c] text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                <span>🔥 TRENDING</span>
              </span>
            )}
            {isNew && !isTrending && (
              <span className="inline-flex items-center gap-1 bg-[#0284c7] text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                <span>✨ NEW</span>
              </span>
            )}
          </div>
        </div>

        {/* cart heart */}
        <div className="hidden group-hover:flex justify-center items-center gap-2 w-full bottom-3 group-hover:animate-slide-top absolute z-20">
          <div onClick={(e) => handleAddWishList(e)}>
            <SelectOption
              Icon={FaHeart}
              className={`${isLiked && "!text-main"}`}
            />
          </div>
          <div onClick={(e) => handleAddToCart(e)}>
            {isExistInCart ? (
              <SelectOption Icon={BsFillCartCheckFill} className="text-main" />
            ) : (
              <SelectOption Icon={BsFillCartPlusFill} />
            )}
          </div>
        </div>
      </div>
      <PriceStartProduct
        to={`${path.PUBLIC}${slug}`}
        totalRating={totalRating}
        price={price}
        discountPrice={discountPrice}
        title={title}
        soldQuantity={soldQuantity}
      />
    </div>
  );
}

export default Product;
