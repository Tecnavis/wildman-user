import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { fetchWishlist,fetchCustomerCart,fetchProducts } from "../../helpers/handle_api";
import { useEffect, useState } from "react";
import "./style.scss"
const IconGroup = ({ iconWhiteClass }) => {


  //wishlist
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
const [products, setProducts] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("customerDetails")) {
      fetchWishlist().then((data) => {
        setWishlistItems(data);
      });
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
      setWishlistItems(guestWishlist);
    }

    if (localStorage.getItem("customerDetails")) {
      fetchCustomerCart().then((data) => {
        setCartItems(data);
      });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    }

    fetchProducts().then((data) => {
      setProducts(data);
      console.log(data, "all products");
      
    });
  }, []);

  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  const { compareItems } = useSelector((state) => state.compare);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    navigate("/shop-grid-no-sidebar", { state: { filteredProducts } });
  };
  return (
    <>
    <div className={clsx("header-right-wrap", iconWhiteClass)} >
     <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="button-search" type="submit">
            <i className="pe-7s-search" />
          </button>
        </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/login-register"}>
                Register
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/my-account"}>
                my account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div> */}
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
           {wishlistItems.length}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems.length}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
          {cartItems.length}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
      <br/>  
      
    </div>
    {/* //moble view search bar */}
    <div className="same-style mobile-off-canvas d-block d-lg-none">
    <div className="search-bar-container">
          <form className="search-bar-form" onSubmit={handleSearch}>
            <input
            style={{height:"45px"}}
              type="text"
              className="search-input"
              placeholder="Search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
</div>
    </>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
