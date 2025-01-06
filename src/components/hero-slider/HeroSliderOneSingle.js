import { useEffect, useState } from "react";
import { URL, fetchBanner } from "../../helpers/handle_api";
import './style.scss'

const HeroSliderOneSingle = () => {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchBanner()
      .then((res) => {
        setBanner(res);
      })
      .catch((err) => {
        console.log("Error fetching banner:", err);
      });
  }, []);
  return (
    <div className="single-slider ">
      <div className="slider-container">
        {banner.map((item) => (
          <div key={item._id} className="slider-item">
            <div className="image-container">
              <img
                className="animated img-fluid"
                src={`${URL}/images/${item.image}`}
                alt=""
              />
            </div>
            <div className="content-container">
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSliderOneSingle;
