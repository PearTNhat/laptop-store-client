/* eslint-disable react/prop-types */
import path from "~/constants/path";
import { BsFillCartPlusFill } from "react-icons/bs";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { DefaultProduct, NewLabel, TrendingLabel } from "~/assets/images";
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
  let label = {};
  if (isNew) {
    label.img = NewLabel;
    label.text = "New";
  }
  if (isTrending) {
    label.img = TrendingLabel;
    label.text = "Trending";
  }

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
        "rounded-md border border-gray-300  cursor-pointer group " + className
      }
    >
      <div className="mb-3 relative">
        <Link
          to={`${path.PUBLIC}${slug}`}
          className="block"
          onClick={onClickLink}
        >
          <div className="css-w-img ">
            <div className="css-img-item">
              <img
                src={primaryImage || DefaultProduct}
                alt={title}
                className="m-auto"
              />
            </div>
          </div>
        </Link>
        <img
          src={label.img}
          alt={label.text}
          className="absolute w-[67px] right-[-12px] top-[-10px]"
        />
        {/* cart heart */}
        <div className="hidden  group-hover:flex justify-center items-center gap-2 w-full group-hover:animate-slide-top absolute">
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
