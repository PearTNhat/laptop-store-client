/* eslint-disable react/prop-types */
import { memo } from "react";
import Slider from "react-slick";

function CustomPaging({images}) {
  const settings = {
    customPaging: function(i) {
      return (
        <div className="">
          <img src={images[i]?.url} className="w-full h-full object-cover"/>
        </div>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className="slider-container" id="custom-paging">
      <Slider {...settings}>
        {
            images?.map((image) => {
                return (
                <div key={image.url} className=" ">
                    <img src={image.url} alt={""} className="!w-[80%] mx-auto"/>
                </div>
                );
            })
        }
      </Slider>
    </div>
  );
}

export default memo(CustomPaging);
