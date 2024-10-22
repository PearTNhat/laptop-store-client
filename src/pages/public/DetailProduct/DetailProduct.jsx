import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
let firstRender = true;
function DetailProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [otherProduct, setOtherProduct] = useState([]);
  const [colorProduct, setColorProduct] = useState({});
  const [fetchAgain, setFetchAgain] = useState(false);
  const stars = useCallback(() => {
    return convertNumberToStar(product?.totalRating);
  }, [product]);
  async function getProductDetail(slug) {
    // goi product detail và lấy ra product theo category
    const {data,success} = await getProduct({ slug });
    setProduct(data);
    setColorProduct(data.colors[0]);
    if(success && otherProduct.length === 0){
      const oProducts =await getAllProducts({ params: { 'slug[ne]': slug, 'category':data.category.slug} })
      if (oProducts?.success) setOtherProduct(oProducts.data)
    }
  }
  console.log('c',colorProduct?.images)
  useEffect(() => {
    getProductDetail(slug);
    window.scrollTo(0, 0);
  }, [fetchAgain,slug]);
  return (
    <div className="main-container text-black my-2">
      <Breadcrumbs title={product.title} />
      <div className="flex flex-wrap gap-4">
        <div className="max-md:w-full w-[calc(50%-8px)] overflow-auto">
          <CustomPaging images={colorProduct?.images || []}/>
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
          <ul className="list-disc pl-[19px]">
            {product.description?.map((desc) => (
              <li key={desc}>{desc}</li>
            ))}
          </ul>
          <div className="flex items-center gap-3 my-2">
            <p className="font-medium">Color:</p>
            <div className="flex flex-wrap gap-2 cursor-pointer">
              {product.colors?.map((color) => (
                <div
                  key={color.color}
                  className={`flex items-center border ${color.color === colorProduct.color? ' border-main' : 'border-gray-300'} rounded-sm py-1`}
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
          <div className="flex gap-5 my-3">
            <Button wf className={"uppercase font-medium"}>
              Buy now
            </Button>
            <Button wf outline className={"uppercase font-medium"}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      <OtherInfoProduct/>
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

export default DetailProduct;
