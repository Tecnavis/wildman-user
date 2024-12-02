import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";

const ProductGridListSingle = () => {
  const [modalShow, setModalShow] = useState(false);
 

  return (
    <Fragment>
        <div className={clsx("product-wrap")}>
          <div className="product-img">
            <Link to="/product/4">
              <img
                className="default-img"
                src="/assets/img/product/fashion/2.jpg"
                alt=""
              />
              {/* //hover image */}
                <img
                  className="hover-img"
                  src="/assets/img/product/fashion/2.jpg"
                  alt=""
                />
            </Link>
              <div className="product-img-badges">
                  <span className="pink">-12%</span>
                
                 <span className="purple">New</span> 
              </div>

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button>
                  <i className="pe-7s-like" />
                </button>
              </div>
              <div className="pro-same-action pro-cart">
                  <button>
                    <i className="pe-7s-cart"></i> Add To cart
                  </button>
              </div>
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
            <h3>
              <Link to="/product/4">
                Product Name
              </Link>
            </h3>
              <div className="product-rating">
                <Rating ratingValue={4} />
              </div>
            <div className="product-price">
                <Fragment>
                  <span>₹1200</span>{" "}
                  <span className="old">
                  ₹1900
                  </span>
                </Fragment>
            </div>
          </div>
        </div>
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Fragment>
  );
};


export default ProductGridListSingle;
