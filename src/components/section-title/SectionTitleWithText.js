import PropTypes from "prop-types";
import clsx from "clsx";
import { URL,fetchAbout } from "../../helpers/handle_api";
import { useEffect, useState } from "react";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {

  const [about, setAbout] = useState([]);

  useEffect(() => {
    fetchAbout().then((res) => {
      setAbout(res);
    });
  })
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        {about.map((single) => (
          
        
        <div className="welcome-content text-center">
          <h5>Who We Are</h5>
          <h1>{single.title}</h1>
          <p>
            {single.description}{" "}
          </p>
        </div>
        ))}
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;
