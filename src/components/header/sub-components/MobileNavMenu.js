import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();
  const customerDetails = localStorage.getItem("customerDetails");
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
      <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{t("Home")}</Link>
          </li>
      <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-filter"}>
              {t("All Products")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
              {t("Collection")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/about"}>{t("About")}</Link>
          </li>

          <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>{t("Contact")}</Link>
          </li>
          <div>
      <ul>
        {!customerDetails ? (
          <>
            {/* Show Login and Register when no customer details */}
            <li>
              <Link to={`${process.env.PUBLIC_URL}/login-register`}>Login</Link>
            </li>
            <li>
              <Link to={`${process.env.PUBLIC_URL}/login-register`}>
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            {/* Show My Account and Logout when customer details exist */}
            <li>
              <Link to={`${process.env.PUBLIC_URL}/my-account`}>My Account</Link>
            </li>
            <li>
              <Link to="#" onClick={() => localStorage.removeItem("customerDetails")}>
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
