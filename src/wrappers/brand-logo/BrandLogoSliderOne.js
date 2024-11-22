import PropTypes from "prop-types";
import clsx from "clsx";
import Swiper, { SwiperSlide } from "../../components/swiper";
import BrandLogoOneSingle from "../../components/brand-logo/BrandLogoOneSingle";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";
import { URL, fetchProducts } from "../../helpers/handle_api";
import { useEffect, useState } from "react";

const settings = {
  loop: true,
  autoplay: true,
  grabCursor: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
    },
    640: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 5,
    },
    768: {
      slidesPerView: 4,
    },
  },
};

const BrandLogoSliderOne = ({ spaceBottomClass, spaceTopClass }) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts().then((res) => {
      setProducts(res);
    });
  },[]);
  return (
    <div className={clsx("brand-logo-area", spaceBottomClass, spaceTopClass)}>
      <div className="container">
        <div className="brand-logo-active">
          {products && (
            <Swiper options={settings}>
              {products.map((data, key) => (
                <SwiperSlide key={key}>
                  <div className={clsx("single-brand-logo", spaceBottomClass)}>
                    <img
                      src={`${URL}/images/${data.coverimage}`}
                      alt=""
                      style={{ width: "100%" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandLogoSliderOne;
