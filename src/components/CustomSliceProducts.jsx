
import Slider from "react-slick";
import Product from "~/pages/public/Home/component/Product/Product";
/* eslint-disable react/prop-types */
function CustomSliceProducts({ products,isNew,isTrending }) {
    const settings = {
        infinite: false,
        // autoplay: true,
        autoplaySpeed: 2000,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };
    return (
        <Slider {...settings}>
            {products.map((item) => (
              <Product
                key={item._id}
                price={item.price}
                discountPrice={item.discountPrice}
                primaryImage={item.primaryImage.url}
                title={item.title}
                slug={item.slug}
                isNew={isNew}
                isTrending={isTrending}
                totalRating={item.totalRating}
              />
            ))}
          </Slider>
    )
}

export default CustomSliceProducts