/* eslint-disable react/prop-types */
import Slider from "react-slick";

function CustomPaging({images}) {
  const settings = {
    customPaging: function(i) {
      return (
        <div className="">
          <img src={images[i].url} />
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
            images?.map((image,index) => {
                return (
                <div key={index} className=" ">
                    <img src={image.url} alt={""} className="!w-[80%] mx-auto"/>
                </div>
                );
            })
        }
      </Slider>
    </div>
  );
}

export default CustomPaging;
