import { useEffect, useState } from "react";
import { URL, fetchBanner } from "../../helpers/handle_api";
import { Link } from "react-router-dom";
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
              <h3 className="animated">{item.title}</h3>
              <h1 className="animated">{item.description}</h1>
              <div className="sliders-btn btn-hover">
                <Link className="animated" to="#">
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSliderOneSingle;
