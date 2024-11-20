import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createCustomerCart,
  createWishlist,
  fetchCustomerCart,
  fetchProductDetails,
  fetchProducts,
  fetchWishlist,
  URL,
} from "../../helpers/handle_api";
import ProductRating from "../../components/product/sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import LayoutOne from "../../layouts/LayoutOne";
import SEO from "../../components/seo";
import { Breadcrumb, Nav, Tab } from "react-bootstrap";
import "./style.scss";
import Swal from "sweetalert2";
import clsx from "clsx";
import ProductModal from "../../components/product/ProductModal";
import SectionTitle from "../../components/section-title/SectionTitle";

const ProductView = ({ spaceTopClass, spaceBottomClass }) => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [modalShow, setModalShow] = useState(false);
  const [products, setProducts] = useState([]);
  // Helper function to shuffle the array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Fetch and display random 6 products
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        const shuffledProducts = shuffleArray(res);
        setProducts(shuffledProducts.slice(0, 4));
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
      });
  }, []);
  //add to recently viewed
  const addToRecentlyViewed = (product) => {
    let recentlyViewed =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const exists = recentlyViewed.find((item) => item._id === product._id);
    if (!exists) {
      recentlyViewed.unshift(product);
      if (recentlyViewed.length > 6) recentlyViewed.pop();
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
  };
  //product view as popup
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalShow(true);
  };
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
  //add to wishlist
  const handleAddToWishlist = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      let guestWishlist =
        JSON.parse(localStorage.getItem("guestWishlist")) || [];
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
  {product.discount > 0 ? (
    <Fragment>
      <span style={{ color: "red", paddingRight: "10px" }}>
        RS. {(product.price * (1 - product.discount / 100)).toFixed(2)}
      </span>
      <span className="old">MRP. {product.price}.00</span>
      <p style={{ color: "green" }}>
        You saved RS.{" "}
        {(product.price - product.price * (1 - product.discount / 100)).toFixed(
          2
        )}
        !
      </p>
    </Fragment>
  ) : (
    <span >RS. {product.price.toFixed(2)}</span>
  )}
</div>

                  <br />
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <ProductRating ratingValue={product.rating} />
                    </div>
                  </div>
                  <div className="pro-details-list"></div>

                  <div className="pro-details-size-color" style={{display:"flex"}}>
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
                  <div className="pro-details-size-color" style={{display:"flex"}}>
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
                      <button onClick={() => handleAddToCart(product)}>
                        {" "}
                        Add to cart
                      </button>
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
                  <div style={{ lineHeight: "35px" }} className="des col-12">
                    <u>
                      <a className="desc" style={{ fontWeight: "bold" }}>
                        ABOUT THIS PRODUCT
                      </a>
                    </u>
                    <br />
                    <div className="product-price">
  {product.gst ? (
    <Fragment>
      <span>MRP: {product.price + product.gst}/- Includes GST</span>
    </Fragment>
  ) : (
    <Fragment>
      <span>MRP: {product.price}/-</span>
    </Fragment>
  )}
</div>
                    Shipping <br />
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
        <div className={clsx("description-review-area")}>
          <div className="container">
            <div className="description-review-wrapper">
              <Tab.Container defaultActiveKey="productDescription">
                <Nav variant="pills" className="description-review-topbar">
                  <Nav.Item>
                    <Nav.Link eventKey="additionalInfo">
                      Additional Info
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="productDescription">
                      Description
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="productReviews">Reviews(2)</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="description-review-bottom">
                  <Tab.Pane eventKey="additionalInfo">
                    <div className="product-anotherinfo-wrapper">
                      <ul>
                        <li>
                          {product.price && (
                            <span>
                              MRP: {product.price} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {" "}
                          {product.warranty && (
                            <span>
                              Warranty: {product.warranty}
                              <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.weight && (
                            <span>
                              Weight: {product.weight} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.height && (
                            <span>
                              Height: {product.height} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.compartment && (
                            <span>
                              Compartment: {product.compartment} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.meterial && (
                            <span>
                              Material: {product.meterial} <br />
                            </span>
                          )}
                        </li>

                        <li>
                          {product.outermeterial && (
                            <span>
                              Outer material: {product.outermeterial} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.brand && (
                            <span>
                              Brand: {product.brand} <br />
                            </span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="productDescription">
                    <h4 className="desc">{product.title}</h4>
                    <p className="des">{product.description}</p>
                    <br />
                    <p className="des">
                      Vestibulum ante ipsum primis aucibus orci luctustrices
                      posuere cubilia Curae Suspendisse viverra ed viverra.
                      Mauris ullarper euismod vehicula. Phasellus quam nisi,
                      congue id nulla. Vestibulum ante ipsum primis aucibus orci
                      luctustrices posuere cubilia Curae Suspendisse viverra ed
                      viverra. Mauris ullarper euismod vehicula. Phasellus quam
                      nisi, congue id nulla. Vestibulum ante ipsum primis
                      aucibus orci luctustrices posuere cubilia Curae
                      Suspendisse viverra ed viverra. Mauris ullarper euismod
                      vehicula. Phasellus quam nisi, congue id nulla. Vestibulum
                      ante ipsum primis aucibus orci luctustrices posuere
                      cubilia Curae Suspendisse viverra ed viverra. Mauris
                      ullarper euismod vehicula. Phasellus quam nisi, congue id
                      nulla.
                    </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="productReviews">
                    <div className="row">
                      <div className="col-lg-7">
                        <div className="review-wrapper">
                          <div className="single-review">
                            <div className="review-img">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/img/testimonial/1.jpg"
                                }
                                alt=""
                              />
                            </div>
                            <div className="review-content">
                              <div className="review-top-wrap">
                                <div className="review-left">
                                  <div className="review-name">
                                    <h4>White Lewis</h4>
                                  </div>
                                  <div className="review-rating">
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                  </div>
                                </div>
                              </div>
                              <div className="review-bottom">
                                <p>
                                  Vestibulum ante ipsum primis aucibus orci
                                  luctustrices posuere cubilia Curae Suspendisse
                                  viverra ed viverra. Mauris ullarper euismod
                                  vehicula. Phasellus quam nisi, congue id
                                  nulla.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="ratting-form-wrapper pl-50">
                          <h3>Add a Review</h3>
                          <div className="ratting-form">
                            <form action="#">
                              <div className="star-box">
                                <span>Your rating:</span>
                                <div className="ratting-star">
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="rating-form-style mb-10">
                                    <input placeholder="Name" type="text" />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="rating-form-style mb-10">
                                    <input placeholder="Email" type="email" />
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="rating-form-style mb-10">
                                    <input
                                      type="text"
                                      name="Your Review"
                                      placeholder="Message"
                                      defaultValue={""}
                                    />
                                  </div>
                                  <input
                                    style={{
                                      backgroundColor: "black",
                                      color: "white",
                                    }}
                                    className="button"
                                    type="submit"
                                    defaultValue="Submit"
                                  />
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
        <hr />
        <br />
        <SectionTitle
          titleText="POPULAR PRODUCTS"
          positionClass="text-center"
        />
        <br />
        <div className="container">
        <div className="row">
  {products.map((data, index) => (
    <div
      className="col-6 col-sm-6 col-md-6 col-lg-3"
      key={index}
    >
      <div className="product-wrap">
        <div className="product-img">
          <Link
            to={`/productview/${data._id}`}
            onClick={() => addToRecentlyViewed(data)}
          >
            <img
              className="default-img"
              src={`${URL}/images/${data.coverimage}`}
              alt=""
            />
            <img
              className="hover-img"
              src={`${URL}/images/${data.coverimage}`}
              alt=""
            />
          </Link>
          <div className="product-img-badges">
            {data.discount && (
              <span className="pink">-{data.discount}%</span>
            )}
          </div>
        </div>
        <div className="product-content text-center">
          <a className="des">{data.description}</a>
          <div className="product-price">
            <span>$1000.00</span>
          </div>
          <h5 className="des">
            <Link to={`/productview/${data._id}`}>{data.title}</Link>
          </h5>
        </div>
      </div>
    </div>
  ))}
</div>

</div>

        <br />

        <ProductModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          product={selectedProduct}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default ProductView;
