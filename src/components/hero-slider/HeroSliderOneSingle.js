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
  const renderDescription = (description) => {
    // Split the description into words
    const words = description.split(" ");
    // Group the words into chunks of 3
    const lines = [];
    for (let i = 0; i < words.length; i += 3) {
      lines.push(words.slice(i, i + 3).join(" "));
    }
    // Render each line
    return lines.map((line, index) => (
      <div key={index} className="description-line">
        {line}
      </div>
    ));
  };
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
              {/* <h3 className="animated">{item.title}</h3>
              <h1 className="animated">
                {renderDescription(item.description)}
              </h1> */}
              {/* <div className="sliders-btn btn-hover">
                <Link className="animated" to="#">
                  SHOP NOW
                </Link>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSliderOneSingle;
