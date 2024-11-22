import PropTypes from "prop-types";
import clsx from "clsx";
import textGridData from "../../data/text-grid/text-grid-one.json";
import TextGridOneSingle from "../../components/text-grid/TextGridOneSingle.js";
import { fetchAbout } from "../../helpers/handle_api.js";
import { useEffect, useState } from "react";

const TextGridOne = ({ spaceBottomClass }) => {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    fetchAbout().then((res) => {
      setAbout(res);
    });
  });
  return (
    <div className={clsx("about-mission-area", spaceBottomClass)}>
      <div className="container">
        {about.map((data, key) => (
          <div className="row" key={key}>
            <div className="col-lg-4 col-md-4">
              <div className={clsx("single-mission", spaceBottomClass)}>
                <h3> Our Vision</h3>
                <p>{data.vision}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className={clsx("single-mission", spaceBottomClass)}>
                <h3> Our Mission</h3>
                <p>{data.mission}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className={clsx("single-mission", spaceBottomClass)}>
                <h3> Our Goal</h3>
                <p>{data.goal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TextGridOne.propTypes = {
  spaceBottomClass: PropTypes.string,
};

export default TextGridOne;
