import DOMPurify from "dompurify";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts, getProduct } from "~/apis/product";
import Breadcrumbs from "~/components/Breadcrumbs";
import Button from "~/components/Button";
import {
  calculatePercent,
  convertNumberToStar,
  formatNumber,
} from "~/utils/helper";
import CustomPaging from "~/components/CustomePagging";
import OtherInfoProduct from "./component/OtherInfoProduct";
import CustomSliceProducts from "~/components/CustomSliceProducts";
import CommentContainer from "~/components/Comments/CommentContainer";
import QuantityInput from "~/components/QuantityInput";
import { apiUpdateCart } from "~/apis/user";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Toast } from "~/utils/alert";
import { fetchCurrentUser } from "~/store/action/user";
function DetailProduct() {
  const { slug } = useParams();
  const descRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {accessToken} = useSelector((state) => state.user);
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
    // goi product detail và lấy ra product theo category
    const { data, success } = await getProduct({ slug });
    setProduct(data);
    setColorProduct(data.colors[0]);
    if (success && otherProduct.length === 0) {
      const oProducts = await getAllProducts({
        params: { "slug[ne]": slug, category: data.category.slug },
      });
      if (oProducts?.success) setOtherProduct(oProducts.data);
    }
  }
  const handleAddToCart =async () => {
    if(!accessToken){
      Swal.fire(
        {
          title: "Oops!",
          text: "Please login to add to cart",
          icon: "info",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          confirmButtonText: "Go to login",
        }
      ).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      });
      return;
    }
    const body ={
      product: product._id,
      color: colorProduct.color,
      quantity
    }
    const response = await apiUpdateCart({accessToken,body});
    if(response?.success){
      Toast.fire({
        icon: "success",
        title: "Add to cart success",
      });
      dispatch(fetchCurrentUser({ token: accessToken }));
    }else{
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
  }, [fetchAgain, slug]);
  return (
    <div className="main-container text-black my-2">
      <Breadcrumbs title={product.title} />
      <div className="flex flex-wrap gap-4">
        <div className="max-md:w-full w-[calc(50%-8px)] overflow-auto">
          <CustomPaging images={colorProduct?.images || []} />
        </div>
        <div className="max-md:w-full w-[calc(50%-8px)]">
          <h2 className="font-medium text-2xl">{product.title}</h2>
          <div className="flex items-center text-[13px] font-medium gap-1 my-2">
            <p className="text-xl font-semibold text-black">
              {formatNumber(product.discountPrice)} ₫
            </p>
            {/* Giá chưa giảm */}
            <p className="line-through text-[#6b7280] ">
              {formatNumber(product.price)} ₫
            </p>
            {/* % */}
            <p className={`ml-1 text-main`}>
              -{calculatePercent(product.price, product.discountPrice)}%
            </p>
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
          <ul
            className={`list-disc pl-[19px] text-sm ${
              !isReadMore && "line-clamp-[10]"
            }`}
            ref={descRef}
          >
            {product?.description?.length > 1 &&
              product.description?.map((desc) => <li key={desc}>{desc}</li>)}
            {product?.description?.length === 1 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}
              ></div>
            )}
          </ul>
          {(isClamped || isReadMore) && (
            <p
              onClick={() => setIsReadMore(!isReadMore)}
              className="underline cursor-pointer text-xs text-blue-400 hover:text-blue-600 text-right"
            >
              {isReadMore ? "Show less" : "Read more"}
            </p>
          )}
          <div className="flex items-center  gap-2 mt-3">
            <p className="font-medium w-[80px]">Color</p>
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
                  style={{ backgroundColor: color.color }}
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
            <p className="font-medium w-[80px]">Quantity</p>
            <QuantityInput setQuantity={setQuantity} quantity={quantity} />
          </div>
          <div className="flex gap-5 my-3">
            <Button wf className={"uppercase font-medium"}>
              Buy now
            </Button>
            <Button
              wf
              outline
              className={"uppercase font-medium"}
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      <OtherInfoProduct />
      {/* other products */}
      <div className="">
        <div className="uppercase border-b-2 border-b-main text-bl py-4 text-[20px] font-semibold">
          Other customers also buy
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
  );
}

export default  DetailProduct;
