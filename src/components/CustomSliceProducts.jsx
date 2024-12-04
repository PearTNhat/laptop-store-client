import Slider from "react-slick";
import Product from "~/pages/public/Home/component/Product/Product";
/* eslint-disable react/prop-types */
function CustomSliceProducts({ customSetting, products, isNew, isTrending }) {
  const settings = {
    infinite: false,
    // autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    customSetting,
  };
  return (
    <Slider {...settings}>
      {products.map((item) => (
        <div key={item._id} className="mt-4">
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
            className={"p-3 mb-3 mx-3"}
          />
        </div>
      ))}
    </Slider>
  );
}

export default CustomSliceProducts;
