import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts, getProduct } from "~/apis/product";
import Breadcrumbs from "~/components/Breadcrumbs";
import Button from "~/components/Button";
import {
  calculatePercent,
  capitalizeFirstCharacter,
  convertNumberToStar,
  formatNumber,
} from "~/utils/helper";
import CustomPaging from "~/components/CustomePagging";
import CustomSliceProducts from "~/components/CustomSliceProducts";
import CommentContainer from "~/components/Comments/CommentContainer";
import QuantityInput from "~/components/QuantityInput";
import { apiUpdateCart } from "~/apis/user";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Toast } from "~/utils/alert";
import { fetchCurrentUser } from "~/store/action/user";
import DetailInfo from "./component/DetailInfo";
function DetailProduct() {
  const { slug } = useParams();
  const descRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.user);
  const [product, setProduct] = useState({});
  const [otherProduct, setOtherProduct] = useState([]);
  const [colorProduct, setColorProduct] = useState({});
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const stars = useCallback(() => {
    return convertNumberToStar(product?.totalRating);
  }, [product]);
  async function getProductDetail(slug) {
    // goi product detail
    const { data, success } = await getProduct({ slug });
    setProduct(data);
    let flag = false;
    for (let i = 0; i < data.colors.length; i++) {
      if (data.colors[i].primaryImage.url === data.primaryImage.url) {
        flag = true;
        setColorProduct(data.colors[i]);
        break;
      }
    }
    if (!flag) setColorProduct(data.colors[0]);
    if (success && otherProduct.length === 0) {
      const oProducts = await getAllProducts({
        params: { "slug[ne]": slug,"sort":"-totalRating","need":data.configs?.need.description},
      });
      if (oProducts?.success) setOtherProduct(oProducts.data);
    }
  }
  const handleBuyNow = async () => {
    try {
      const res = await handleAddToCart();
      if (res === 1) {
        navigate("/user/cart");
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: error.message });
    }
  };
  const handleAddToCart = async () => {
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
    const body = {
      product: product._id,
      color: colorProduct.color,
      quantity,
    };
    const response = await apiUpdateCart({ accessToken, body });
    if (response?.success) {
      Toast.fire({
        icon: "success",
        title: "Add to cart success",
      });
      dispatch(fetchCurrentUser({ token: accessToken }));
      return 1;
    } else {
      Toast.fire({
        icon: "error",
        title: "Add to cart fail",
      });
    }
  };
  useEffect(() => {
    const element = descRef.current;
    if (element) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, [product]);
  useEffect(() => {
    getProductDetail(slug);
    window.scrollTo(0, 0);
  }, [slug]);
  useEffect(() => {
    // tranh truong hop len lai dau trang
    if (!product?._id) return;
    getProductDetail(slug);
  }, [fetchAgain]);
  return (
    <div className="text-black my-2">
      <div className="py-2 mb-8 bg-[#f7f7f7]">
        <div className="main-container">
          <h3 className="uppercase text-xl font-semibold text-black">
            Chi tiết sản phẩm
          </h3>
          <Breadcrumbs title={product.title?.split("-")[0]} />
        </div>
      </div>
      <div className="main-container ">
        <div className="flex flex-wrap gap-4">
          <div className="max-md:w-full w-[calc(40%-8px)] overflow-auto">
            <CustomPaging images={colorProduct?.images || []} />
          </div>
          <div className="max-md:w-full w-[calc(60%-8px)] mt-6">
            <h2 className="font-medium text-2xl">{product.title}</h2>
            <p><span className="text-gray-500">Thương hiệu:</span> <span className="text-red-400">{capitalizeFirstCharacter(product.brand)}</span></p>
            <div className="flex items-center text-[13px] font-medium gap-1 my-2">
              <p className="text-xl font-semibold text-black">
                {formatNumber(product.discountPrice)} ₫
              </p>
              {product.price !== 0 && (
                <>
                  {/* Giá chưa giảm */}
                  <p className="line-through text-[#6b7280] ">
                    {formatNumber(product.price)} ₫
                  </p>
                  {/* % */}
                  <p className={`ml-1 text-main`}>
                    -{calculatePercent(product.price, product.discountPrice)}%
                  </p>
                </>
              )}
            </div>

            <div className="flex text-yellow-300 text-[13px] my-2">
              {stars().map((star, index) => {
                return (
                  <span key={index} className="block text-[18px]">
                    {star}
                  </span>
                );
              })}
            </div>
            <div className="mt-1 short-desc">
              <p className="font-medium">Mô tả ngắn gọn:</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: product?.features,
                }}
              ></div>
              <div className="flex items-center  gap-2 mt-3">
                <p className="font-medium w-[80px]">Màu sắc:</p>
                <div className="flex flex-wrap gap-2 cursor-pointer">
                  {product.colors?.map((color) => (
                    <div
                      key={color.color}
                      className={`flex items-center border ${
                        color.color === colorProduct.color
                          ? " border-main"
                          : "border-gray-300"
                      } rounded-sm py-1`}
                      onClick={() => setColorProduct(color)}
                    >
                      <img
                        src={color.primaryImage?.url}
                        alt={color.color}
                        className="w-[32px] h-[32px]"
                      />
                      <small className="font-normal pr-1">{color.color}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <p className="font-medium w-[80px]">Số lượng:</p>
                <QuantityInput setQuantity={setQuantity} quantity={quantity} />
              </div>
            </div>
            <div className="flex gap-5 my-3">
              <Button
                wf
                className={"uppercase font-medium"}
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
              <Button
                wf
                outline
                className={"uppercase font-medium"}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
          <div className="flex flex-1 gap-5">
            <div className="w-[calc(70%)] pr-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-4 rounded-md">
              <h2 className="font-semibold text-xl mb-4">Mô tả sản phẩm</h2>
              <div className="flex flex-col">
                <ul
                  className={`list-disc text-sm ${
                    !isReadMore && "line-clamp-[12]"
                  }`}
                  ref={descRef}
                >
                  {product?.description?.length === 1 && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product?.description[0],
                      }}
                    ></div>
                  )}

                  {/* DOMPurify.sanitize(product?.description) nó chặn k cho xài YT tìm hiểu nó */}
                </ul>
                {(isClamped || isReadMore) && (
                  <p
                    onClick={() => setIsReadMore(!isReadMore)}
                    className="underline cursor-pointer text-sm text-blue-400 hover:text-blue-600 text-center"
                  >
                    {isReadMore ? "Thu gọn nội dung" : "Xem thêm nội dung"}
                  </p>
                )}
              </div>
            </div>
            <div className="w-[calc(30%)]">
              <DetailInfo configs={product.configs} />
            </div>
          </div>
        </div>
        {/* <OtherInfoProduct /> */}
        {/* other products */}
        <div className="">
          <div className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold">
            Sản phẩm bạn có thể thích
          </div>
          <CustomSliceProducts products={otherProduct} />
        </div>
        {/* comment */}
        <CommentContainer
          title={product.title}
          pId={product._id}
          comments={product.comments}
          totalRating={product.totalRating}
          setFetchAgain={setFetchAgain}
        />
      </div>
    </div>
  );
}

export default DetailProduct;
