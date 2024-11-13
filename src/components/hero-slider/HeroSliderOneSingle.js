import { useEffect, useState } from "react";
import { URL ,fetchBanner} from "../../helpers/handle_api";
import { Link } from "react-router-dom";

const HeroSliderOneSingle = () => {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchBanner()
      .then((res) => {
        console.log("Fetched banner:", res); 
        setBanner(res);
      })
      .catch((err) => {
        console.log("Error fetching banner:", err);
      });
  }, []);
  return (
    <div className="single-slider slider-height-1 bg-purple">
      <div className="container">
        {banner.map((item) => (
        <div className="row" key={item._id}>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
            <div className="slider-content slider-animated-1">
              <h3 className="animated">{item.title}</h3>
              <h1 className="animated">{item.description}</h1>
              <div className="slider-btn btn-hover">
                <Link
                  className="animated"
                 to ="#"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
            <div className="slider-single-img slider-animated-1">
              <img
                className="animated img-fluid"
                src={`${URL}/images/${item.image}`}
                alt=""
              />
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};



export default HeroSliderOneSingle;
