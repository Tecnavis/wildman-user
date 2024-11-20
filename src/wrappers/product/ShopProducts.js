import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import ProductModal from "../../components/product/ProductModal";
import { Link } from "react-router-dom";
import {
  URL,
  createCustomerCart,
  createWishlist,
  fetchCustomerCart,
  fetchWishlist,
} from "../../helpers/handle_api";
import Swal from "sweetalert2";
import "./style.scss";

const ShopProducts = ({ products, layout }) => {
  const [modalShow, setModalShow] = useState(false);

  const handleAddToWishlist = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      let guestWishlist =
        JSON.parse(localStorage.getItem("guestWishlist")) || [];
      if (guestWishlist.some((item) => item._id === product._id)) {
        Swal.fire({
          icon: "info",
          title: "Already in Wishlist",
          text: "This product is already in your wishlist.",
        });
        return;
      }
      guestWishlist.push(product);
      localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: "The product has been added to your wishlist.",
      });
      return;
    }
    try {
      const wishlistResponse = await fetchWishlist();
      const isProductInWishlist = wishlistResponse.some(
        (item) => item.productId._id === product._id
      );
      if (isProductInWishlist) {
        Swal.fire({
          icon: "info",
          title: "Already in Wishlist",
          text: "This product is already in your wishlist.",
        });
        return;
      }
      await createWishlist({
        productId: product._id,
        customerId: customerDetails._id,
      });
      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: "The product has been added to your wishlist.",
      });
    } catch (error) {
      console.log("Error adding to wishlist", error);
    }
  };
  //add to cart
  const handleAddToCart = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if (!customerDetails) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      // Check if the product is already in the guest wishlist
      const isProductInGuestWishlist = guestCart.some(
        (item) => item._id === product._id
      );

      if (isProductInGuestWishlist) {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
        });
        return;
      }

      // Add product to guest wishlist
      guestCart.push(product);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart.",
      });
      return;
    }

    try {
      const wishlistResponse = await fetchCustomerCart();
      const existingWishlist = wishlistResponse || [];
      // Check if the product is already in the user's wishlist
      const isProductInWishlist = existingWishlist.some(
        (item) => item.productId._id === product._id
      );

      if (isProductInWishlist) {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
        });
        return;
      }

      // Add product to the user's wishlist in the backend
      const cartData = {
        productId: product._id,
        customerId: customerDetails._id,
      };
      await createCustomerCart(cartData);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart.",
      });
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };

  //product view as popup
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalShow(true);
  };
  return (
    <div className="shop-bottom-area mt-35">
      <div className="row">
        <Fragment>
          {products.map((item, index) => (
            <div className={`col-xl-3 col-lg-4 col-sm-6 col-xs-4`} key={index}>
            <Fragment>
                <div className="product-wrap">
                  <div className="product-img">
                    <Link to={`/productview/${item._id}`}>
                      <img
                        className="default-img"
                        src={`${URL}/images/${item.coverimage}`}
                        alt=""
                      />
                      <img
                        className="hover-img"
                        src={`${URL}/images/${item.coverimage}`}
                        alt=""
                      />
                    </Link>
                    <div className="product-img-badges">
                      {item.discount && (
                        <span className="pink">-{item.discount}%</span>
                      )}

                      {index < 5 && <span className="purple">New</span>}
                    </div>
                    <div className="product-action">
                      <div className="pro-same-action pro-wishlist">
                        <button onClick={() => handleAddToWishlist(item)}>
                          <i className="pe-7s-like" />
                        </button>
                      </div>
                      <div className="pro-same-action pro-cart">
                        <button onClick={() => handleAddToCart(item)}>
                          <i className="pe-7s-cart" /> Add To cart
                        </button>
                      </div>
                      <div className="pro-same-action pro-quickview">
                        <button onClick={() => handleQuickView(item)}>
                          <i className="pe-7s-look" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="product-content text-center">
                    <a className="des">{item.description}</a>
                    <div className="product-price">
                      {item.discount > 0 ? (
                        <Fragment>
                          <span style={{ color: "red", paddingRight: "10px" }}>
                            RS.{" "}
                            {(item.price * (1 - item.discount / 100)).toFixed(
                              2
                            )}
                          </span>
                          <span className="old">MRP. {item.price}.00</span>
                        </Fragment>
                      ) : (
                        <span style={{ color: "red" }}>
                          RS. {item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <h5 className="des">
                      <Link to={`/productview/${item._id}`}>{item.title}</Link>
                    </h5>
                    <div className="pro-details-rating-wrap">
                      <h5 className="return">{item.subCategory}</h5>
                    </div>
                  </div>
                </div>
              </Fragment>
              <br />
            </div>
          ))}
          <br />
          <ProductModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            product={selectedProduct}
          />
        </Fragment>
      </div>
    </div>
  );
};

ShopProducts.propTypes = {
  layout: PropTypes.string,
  products: PropTypes.array.isRequired,
};

export default ShopProducts;
