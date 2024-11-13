import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
      <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{t("Home")}</Link>
          </li>
      <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-filter"}>
              {t("All Product")}
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
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
