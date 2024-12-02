import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Rating from "./sub-components/ProductRating";
import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";

const ProductGridSingle = ({
  product,
  // currency,
  wishlistItem,
  compareItem,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className="product-wrap">
        <div className="product-img">
          <Link to="/product/4">
            <img
              className="default-img"
              src="/assets/img/product/fashion/2.jpg"
              alt=""
            />
            {/* //hover image */}
            {/* {product.image.length > 1 ? ( */}
              <img
                className="hover-img"
                src="/assets/img/product/fashion/2.jpg"
                alt=""
              />
            {/* ) : (
              ""
            )} */}
          </Link>
            <div className="product-img-badges">
                <span className="pink">-10%</span>
               <span className="purple">New</span>
            </div>

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? "Added to wishlist"
                    : "Add to wishlist"
                }
               
              >
               <a href="/wishlist">
                    <i className="pe-7s-like" />
                    </a>
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {" "}
                  Buy now{" "}
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link to="/product/4">
                  Select Option
                </Link>
              ) : (
                <button disabled className="active">
                  Out of Stock
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button title="Quick View" onClick={() => setModalShow(true)}>
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>

        
        <div className="product-content text-center">
          <h3>
            <Link to="/product/4">
              product name
            </Link>
          </h3>
          {product.rating && product.rating > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          ) : (
            ""
          )}
          <div className="product-price">
              <span>₹1000 </span>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};


export default ProductGridSingle;
