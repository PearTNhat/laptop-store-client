/* eslint-disable react/prop-types */

import Slider from "react-slick";

function CustomSliceStatic({ options, images, className = "", imageClassName = "" }) {
  const isMultiSlide = options?.slidesToShow && options.slidesToShow > 1;

  var settings = {
    dots: !isMultiSlide,
    infinite: true,
    autoplay: true,
    autoplaySpeed: isMultiSlide ? 2200 : 3500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    ...options,
  };

  return (
    <div className={className + " overflow-hidden"}>
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="outline-none px-3">
            {isMultiSlide ? (
              <div className="flex items-center justify-center h-16 sm:h-20 p-2 transition-transform duration-300 hover:scale-105">
                <img
                  src={image.url}
                  alt="partner brand"
                  className={imageClassName || "max-h-12 max-w-[130px] w-auto h-auto object-contain mx-auto"}
                />
              </div>
            ) : (
              <img
                src={image.url}
                alt="banner"
                className={imageClassName || "w-full h-[220px] sm:h-[320px] md:h-[380px] object-cover"}
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomSliceStatic;