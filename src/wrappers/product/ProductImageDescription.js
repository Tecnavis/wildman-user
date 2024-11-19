import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createCustomerCart, createWishlist, fetchCustomerCart, fetchProductDetails, fetchWishlist, URL } from "../../helpers/handle_api";
import ProductRating from "../../components/product/sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import LayoutOne from "../../layouts/LayoutOne";
import SEO from "../../components/seo";
import { Breadcrumb } from "react-bootstrap";
import "./style.scss";
import Swal from "sweetalert2";

const ProductView = ({ spaceTopClass, spaceBottomClass }) => {
  const { id } = useParams(); // Retrieve product ID from the URL
  const [product, setProduct] = useState(null); // State to hold product data

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const productData = await fetchProductDetails(id); // Fetch product details
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    getProductDetails();
  }, []);

  if (!product) return <p>Loading...</p>; // Show loading state if product data is not yet loaded
  if (id) {
    fetchProductDetails(id);
  } else {
    console.error("productId is undefined");
  }
//
const handleAddToWishlist = async (product) => {
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

  if (!customerDetails) {
    // Handle guest user wishlist by using local storage
    let guestWishlist =
      JSON.parse(localStorage.getItem("guestWishlist")) || [];

    // Check if the product is already in the guest wishlist
    const isProductInGuestWishlist = guestWishlist.some(
      (item) => item._id === product._id
    );

    if (isProductInGuestWishlist) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        text: "This product is already in your wishlist.",
      });
      return;
    }

    // Add product to guest wishlist
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
    const existingWishlist = wishlistResponse || [];

    // Check if the product is already in the user's wishlist
    const isProductInWishlist = existingWishlist.some(
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

    // Add product to the user's wishlist in the backend
    const wishlistData = {
      productId: product._id,
      customerId: customerDetails._id,
    };
    await createWishlist(wishlistData);

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
  return (
    <Fragment>
      <SEO titleTemplate="Product Page" description="Product details page." />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Product Details", path: "" },
          ]}
        />
        <div className={`shop-area ${spaceTopClass} ${spaceBottomClass}`}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="product-large-image-wrapper">
                  <div className="product-img-badges">
                    {product.discount && (
                      <span className="pink">-{product.discount}%</span>
                    )}
                    <span className="purple">New</span>
                  </div>
                  <Swiper>
                    <SwiperSlide>
                      <div className="single-image">
                        <img
                          src={`${URL}/images/${product.coverimage}`}
                          className="img-fluid"
                          alt={product.name}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                  <div className="row">
                    <div className="col-12">
                      <div className="product-images-wrapper d-flex flex-wrap justify-content-start">
                        {product.images.map((img, idx) => (
                          <div className="single-image col-6 p-2" key={idx}>
                            <img
                              src={`${URL}/images/${img}`}
                              className="img-fluid"
                              alt={`product-image-${idx}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="product-details-content ml-70">
                  <a className="des">{product.title}</a>
                  <h5 className="des" style={{ textTransform: "uppercase" }}>
                    <Link to="">{product.description}</Link>
                  </h5>

                  {/* <h2>{product.mainCategory}</h2> */}
                  <div className="product-price">
                    <Fragment>
                      <span style={{ color: "red", paddingRight: "10px" }}>
                        RS.
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>{" "}
                      <span className="old">
                        MRP.{product.price}.00
                      </span>
                    </Fragment>
                  </div>

                  <br />
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <ProductRating ratingValue={product.rating} />
                    </div>
                  </div>
                  <div className="pro-details-list">
                    {/* <p>{product.description}</p> */}
                  </div>

                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <a className="des"> Size :</a>
                    </div>
                    {product.sizes.map((size) => (
                      <div className="pro-details-size" key={size._id}>
                        <div className="pro-details-size-content">
                          <label className={`pro-details-size-content--single`}>
                            <input type="radio" value={"M"} />
                            <span className="size-name"> {size.size}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <a className="des">Color :</a>
                    </div>
                    <div className="pro-details-size">
                      <div className="pro-details-size-content">
                        <a className="des"> {product.color}</a>
                        {/* </label> */}
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
                      <button onClick={() => handleAddToCart(product)}> Add to cart</button>
                    </div>
                    <div className="pro-details-wishlist">
                      <button onClick={() => handleAddToWishlist(product)}> 
                        <i className="pe-7s-like" />
                      </button>
                    </div>
                    <div className="pro-details-compare">
                      <button>
                        <i className="pe-7s-shuffle" />
                      </button>
                    </div>
                  </div>

                  {product.returnpolicy === "Yes" && (
                    <a className="" style={{ color: "red" }}>
                      Return Policy is available{" "}
                    </a>
                  )}

                  <div className="pro-details-meta">
                    <a className="des">Main Category : </a>
                    <ul>
                      <li className="des">
                        <Link to="/shop-grid-standard">
                          {product.mainCategory}
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="pro-details-meta">
                    <a className="des">Sub Category : </a>
                    <ul>
                      <li className="des">
                        <Link to="/shop-grid-standard">
                          {product.subCategory}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <hr />
                  <div className="col-12" style={{ lineHeight: "35px" }}>
                    <a className="des">ABOUT THIS PRODUCT</a>
                    <br />
                    MRP: {product.price + product.gst}/- Includes GST and
                    Shipping <br />
                    Color: {product.color} <br />
                    {product.meterial && (
                      <span>
                        Material: {product.meterial} <br />
                      </span>
                    )}
                    {product.outermeterial && (
                      <span>
                        Outer material: {product.outermeterial} <br />
                      </span>
                    )}
                    {product.warranty && (
                      <span>
                        Warranty: {product.warranty}
                        <br />
                      </span>
                    )}
                    {product.brand && (
                      <span>
                        Brand: {product.brand} <br />
                      </span>
                    )}
                    {product.height && (
                      <span>
                        Height: {product.height} <br />
                      </span>
                    )}
                    {product.weight && (
                      <span>
                        Weight: {product.weight} <br />
                      </span>
                    )}
                    {product.date && (
                      <span>
                        Date of Manufacture:{" "}
                        {new Date(product.date).toLocaleDateString("en-GB")}{" "}
                        <br />
                      </span>
                    )}
                    {product.compartment && (
                      <span>
                        Compartment: {product.compartment} <br />
                      </span>
                    )}
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
              </div>
            </div>
          </div>
        </div>
        <br />
      </LayoutOne>
    </Fragment>
  );
};

export default ProductView;
