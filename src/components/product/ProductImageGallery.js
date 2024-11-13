import React, { Fragment,  } from "react";
import Swiper, { SwiperSlide } from "../../components/swiper";

const ProductImageGallery = ({ product }) => {
  const thumbnailSwiperParams = {
    // onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper">
          <div className="product-img-badges">
          <span className="pink">-5%</span>
          <span className="purple">New</span> 
          </div>
          <Swiper >
              <SwiperSlide >
                <button className="lightgallery-button" >
                  <i className="pe-7s-expand1"></i>
                </button>
                <div className="single-image">
                  <img
                    src="/assets/img/product/fashion/2.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </SwiperSlide>
          </Swiper>

      </div>
      <div className="product-small-image-wrapper mt-15">
          <Swiper options={thumbnailSwiperParams}>
            
              <SwiperSlide >
                <div className="single-image">
                  <img
                    src="/assets/img/product/fashion/2.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </SwiperSlide>
          </Swiper>
      </div>
    </Fragment>
  );
};

export default ProductImageGallery;
