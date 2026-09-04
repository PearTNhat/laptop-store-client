import { useCallback, useState } from "react";
import Slider from "react-slick";
import useWindowSizeCustom from "~/hook/useWindowSizeCustom";
import Product from "~/pages/public/Home/component/Product/Product";
import SkeletonProduct from "~/pages/public/Home/component/Product/SkeletonProduct";
/* eslint-disable react/prop-types */
function CustomSliceProducts({
  customSetting,
  products,
  isNew,
  isTrending,
  loading,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { width } = useWindowSizeCustom();
  const settings = {
    infinite: false,
    slidesToShow: width < 768 ? 2 : 4,
    slidesToScroll: width < 768 ? 2 : 4,
    customSetting,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
  };
  const handleClick = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDragging]
  );

  const shouldShowSkeleton = loading || !products || products.length === 0;

  return (
    <Slider {...settings}>
      {shouldShowSkeleton
        ? Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="px-2 py-4">
              <SkeletonProduct className="p-4" />
            </div>
          ))
        : products.map((item) => (
            <div key={item._id} className="px-2 py-4">
              <Product
                pid={item._id}
                price={item.price}
                discountPrice={item.discountPrice}
                primaryImage={item.primaryImage.url}
                soldQuantity={item.soldQuantity}
                title={item.title}
                slug={item.slug}
                isNew={isNew}
                isTrending={isTrending}
                colors={item.colors}
                totalRating={item.totalRating}
                className="p-4 h-full"
                onClickLink={handleClick}
              />
            </div>
          ))}
    </Slider>
  );
}

export default CustomSliceProducts;
