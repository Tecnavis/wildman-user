import PropTypes from "prop-types";
import clsx from "clsx";
import { fetchAbout, URL } from "../../helpers/handle_api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BannerOne = ({ spaceTopClass, spaceBottomClass }) => {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    fetchAbout().then((res) => {
      setAbout(res);
    });
  },[]);
  return (
    <div className={clsx("banner-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        {about.map((data, key) => (
          <div className="row">
            <div className="col-lg-4 col-md-4" key={key}>
              <div className={clsx("single-banner", spaceBottomClass)}>
                <Link to={process.env.PUBLIC_URL + data.link}>
                  <img src={`${URL}/images/${data.visionimage}`} alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-4" key={key}>
              <div className={clsx("single-banner", spaceBottomClass)}>
                <Link to={process.env.PUBLIC_URL + data.link}>
                  <img src={`${URL}/images/${data.missionimage}`} alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-4" key={key}>
              <div className={clsx("single-banner", spaceBottomClass)}>
                <Link to={process.env.PUBLIC_URL + data.link}>
                  <img src={`${URL}/images/${data.goalimage}`} alt="" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

BannerOne.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default BannerOne;
