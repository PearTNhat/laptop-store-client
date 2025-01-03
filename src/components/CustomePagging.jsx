/* eslint-disable react/prop-types */
import { memo } from "react";
import Slider from "react-slick";

function CustomPaging({images}) {
  const settings = {
    customPaging: function(i) {
      return (
        <div className="w-full h-full">
          <img src={images[i]?.url} className="w-full h-full object-cover"/>
        </div>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className="slider-container" id="custom-paging">
      {
        images?.length === 1 ? (
          <div className=" ">
            <img src={images[0].url} alt={""} className="!w-[80%] mx-auto"/>
          </div>
        ) :
        <Slider {...settings}>
        {
            images?.map((image) => {
                return (
                <div key={image.url} className=" ">
                  <div className="css-w-img">
                    <div className="css-img-item">
                      <img src={image.url} alt={""} className="object-contain h-full p-1"/>
                    </div>
                  </div>
                </div>
                );
            }) 
        }
      </Slider>
      }
      
    </div>
  );
}

export default memo(CustomPaging);
