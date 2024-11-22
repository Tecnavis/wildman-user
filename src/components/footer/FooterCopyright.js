import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLogo, URL } from "../../helpers/handle_api";

const FooterCopyright = ({ footerLogo, spaceBottomClass, colorClass }) => {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    fetchLogo()
      .then((data) => {
        // Assuming data is an array, sort to get the most recent logo
        if (data && data.length > 0) {
          const sortedLogos = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLogo(sortedLogos[0]);
          
        }
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className={clsx("copyright", spaceBottomClass, colorClass)}>
      <div className="footer-logo">
        <Link to={process.env.PUBLIC_URL + "/"}>
        {logo && (
                <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/logo.png"
                }
                  alt="Logo"
                  className="logo"
                  style={{ width: "75px",  }}
                />
              )}
        </Link>
      </div>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href=""
          rel="noopener noreferrer"
          target="_blank"
        >
          Wildman Premium
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string
};

export default FooterCopyright;
