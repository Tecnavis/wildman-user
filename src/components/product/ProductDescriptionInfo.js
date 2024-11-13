
import React from "react";
import { Link } from "react-router-dom";
import Rating from "./sub-components/ProductRating";

const ProductDescriptionInfo = () => {
  return (
    <div className="product-details-content ml-70">
      <h2>product name</h2>
      <div className="product-details-price">
        <span>$500 </span>
      </div>
      <div className="pro-details-rating-wrap">
        <div className="pro-details-rating">
          <Rating ratingValue={4} />
        </div>
      </div>
      <div className="pro-details-list">
        <p>Description</p>
      </div>

      <div className="pro-details-size-color">
        <div className="pro-details-color-wrap">
          <span>Color</span>
          <div className="pro-details-color-content">
            <label className={`pro-details-color-content--single blue`}>
              <input type="radio" value={"blue"} name="product-color" />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <div className="pro-details-size">
          <span>Size</span>
          <div className="pro-details-size-content">
            <label className={`pro-details-size-content--single`}>
              <input type="radio" value={"M"} />
              <span className="size-name">XL</span>
            </label>
          </div>
        </div>
      </div>
      <div className="pro-details-quality">
        <div className="cart-plus-minus">
          <button className="dec qtybutton">-</button>
          <input
            className="cart-plus-minus-box"
            type="text"
            value={1}
            readOnly
          />
          <button className="inc qtybutton">+</button>
        </div>
        <div className="pro-details-cart btn-hover">
          <button>Add to cart</button>
        </div>
        <div className="pro-details-wishlist">
          <button>
            <i className="pe-7s-like" />
          </button>
        </div>
        <div className="pro-details-compare">
          <button>
            <i className="pe-7s-shuffle" />
          </button>
        </div>
      </div>
      <div className="pro-details-meta">
        <span>Categories :</span>
        <ul>
          <li>
            <Link to="/shop-grid-standard">Category</Link>
          </li>
        </ul>
      </div>
      <div className="pro-details-meta">
        <span>Title :</span>
        <ul>
          <li>
            <Link to="/shop-grid-standard">Title</Link>
          </li>
        </ul>
      </div>

      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescriptionInfo;
