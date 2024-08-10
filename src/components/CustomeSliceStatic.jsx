/* eslint-disable react/prop-types */

import Slider from "react-slick";
function CustomeSliceStatic({options,images,className}) {
  
  var settings = {
    dots: false,
    infinite: true,
    // autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...options
  };
  return (
    <div className={className+ ' overflow-hidden'}>
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="">
            <img src={image.url} alt="" className="w-full h-full"/>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomeSliceStatic