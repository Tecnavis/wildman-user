import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createCustomerCart,
  createWishlist,
  fetchCustomerCart,
  fetchProductDetails,
  fetchProducts,
  fetchWishlist,
  URL,
} from "../../helpers/handle_api";
import { Carousel } from "react-bootstrap";
import ProductRating from "../../components/product/sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import LayoutOne from "../../layouts/LayoutOne";
import SEO from "../../components/seo";
import { Breadcrumb, Nav, Tab } from "react-bootstrap";
import "./style.scss";
import Swal from "sweetalert2";
import clsx from "clsx";
import SectionTitle from "../../components/section-title/SectionTitle";

const ProductView = ({ spaceTopClass, spaceBottomClass }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(""); // New state for selected image

  const navigate = useNavigate()
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const productData = await fetchProductDetails(id);
        setProduct(productData);
        // Set the initial selected image when product data is fetched
        if (productData && productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    getProductDetails();
  }, [id]); // Add id as dependency

  // Handler for carousel image click
  const handleImageClick = (img) => {
    setSelectedImage(img);
  };
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

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${URL}/review/${product._id}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setLoading(false);
    }
  };

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
  // Fetch product details
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

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Modify the existing add to cart function to include quantity
  const handleAddToCart = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingProductIndex = guestCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex > -1) {
        // If product already exists, update its quantity
        guestCart[existingProductIndex].quantity =
          (guestCart[existingProductIndex].quantity || 0) + quantity;
      } else {
        // If product is new, add it with the selected quantity
        guestCart.push({
          ...product,
          quantity: quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${quantity} item(s) added to your cart.`,
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
        quantity: quantity, // Include quantity in cart data
      };
      await createCustomerCart(cartData);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${quantity} item(s) added to your cart.`,
      });
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };
  const handleBuyNow = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingProductIndex = guestCart.findIndex(
        (item) => item._id === product._id
      );
  
      if (existingProductIndex > -1) {
        // If product already exists, update its quantity
        guestCart[existingProductIndex].quantity =
          (guestCart[existingProductIndex].quantity || 0) + quantity;
      } else {
        // If product is new, add it with the selected quantity
        guestCart.push({
          ...product,
          quantity: quantity,
        });
      }
  
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${quantity} item(s) added to your cart.`,
      }).then(() => {
        navigate("/cart"); // Redirect after the Swal popup is dismissed
        window.location.reload()
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
        }).then(() => {
          navigate("/cart"); // Redirect to cart even if the product is already in the cart
          window.location.reload()
        });
        return;
      }
  
      const cartData = {
        productId: product._id,
        customerId: customerDetails._id,
        quantity: quantity, // Include quantity in cart data
      };
      await createCustomerCart(cartData);
  
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${quantity} item(s) added to your cart.`,
      }).then(() => {
        navigate("/cart"); // Redirect after the Swal popup is dismissed
      });
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };
  
  //submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to submit a review",
      });
      return;
    }

    const formData = new FormData();
    formData.append("productId", id);
    formData.append("customerId", customerDetails._id);
    formData.append("rating", userRating);
    formData.append("review", reviewText);
    if (reviewImage) {
      formData.append("image", reviewImage);
    }

    try {
      const response = await fetch(`${URL}/review`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted",
          text: "Thank you for your review!",
        });

        // Fetch updated reviews
        const updatedReviewsResponse = await fetch(`${URL}/review/${id}`);
        const updatedData = await updatedReviewsResponse.json();

        if (updatedData.success && Array.isArray(updatedData.reviews)) {
          setReviews(updatedData.reviews);
        } else {
          setReviews([]);
        }

        // Reset form
        setUserRating(0);
        setReviewText("");
        setReviewImage(null);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit review. Please try again.",
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star${index < rating ? "" : "-o"}`}
        style={{ color: index < rating ? "#ffa900" : "#d3ced2" }}
      />
    ));
  };
  const getPairedImages = (images) => {
    const pairs = [];
    for (let i = 0; i < images.length; i += 1) {
      pairs.push(images.slice(i, i + 2));
    }
    return pairs;
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
        /> <div className={`shop-area ${spaceTopClass} ${spaceBottomClass}`}>
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
                        src={`${URL}/images/${selectedImage}`}
                        className="img-fluid"
                        alt={product.name}
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div className="row mt-3">
        <div className="col-12">
          <Carousel
            indicators={true}
            controls={true}
            interval={3000}
            pause="hover"
          >
            {getPairedImages(product.images).map((pair, pairIdx) => (
              <Carousel.Item key={pairIdx}>
                <div className="d-flex justify-content-between">
                  {pair.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="px-1" 
                      style={{ width: '50%' }}
                      onClick={() => handleImageClick(img)}
                    >
                      <img
                        className="d-block w-100"
                        src={`${URL}/images/${img}`}
                        alt={`Product image ${pairIdx * 2 + idx + 1}`}
                        style={{
                          maxHeight: "400px",
                          objectFit: "contain",
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  ))}
                  {/* If there's only one image in the last pair, add an empty div for spacing */}
                  {pair.length === 1 && <div style={{ width: '50%' }}></div>}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
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

                  <div className="product-price">
                    {product.discount > 0 ? (
                      <Fragment>
                        <span style={{ color: "red", paddingRight: "10px" }}>
                          RS.{" "}
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toFixed(2)}
                        </span>MRP.
                        <span className="old"> {product.price}.00</span>
                        <p style={{ color: "green" }}>
                          You saved RS.{" "}
                          {(
                            product.price -
                            product.price * (1 - product.discount / 100)
                          ).toFixed(2)}
                          !
                        </p>
                      </Fragment>
                    ) : (
                      <span>RS. {product.price.toFixed(2)}</span>
                    )}
                  </div>

                  <br />
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <ProductRating ratingValue={product.rating} />
                    </div>
                  </div>
                  {product.returnpolicy === "Yes" && (
                    <a className="" style={{ color: "red" }}>
                      Return Policy is available{" "}
                    </a>
                  )}
                  <div className="pro-details-list"></div>

                  <div
                    className="pro-details-size-color"
                    style={{ display: "flex" }}
                  >
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
                  <div
                    className="pro-details-size-color"
                    style={{ display: "flex" }}
                  >
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
                      <button
                        className="dec qtybutton"
                        onClick={decrementQuantity}
                      >
                        -
                      </button>
                      <input
                        className="cart-plus-minus-box"
                        type="text"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="inc qtybutton"
                        onClick={incrementQuantity}
                      >
                        +
                      </button>
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
                  <div className="pro-details-cart btn-hover" style={{width:"100%"}}>
                    <button  onClick={() => handleBuyNow(product)} className="pro-details-compare" style={{width:"100%",height:"45px",backgroundColor:"black",color:"white",border:"none"}}>
                     Buy Now
                    </button>
                  </div><br/>
                  <hr />
                  <div style={{ lineHeight: "35px" }} className="des col-12">
                    <u>
                      <a className="desc" style={{ fontWeight: "bold" }}>
                        ABOUT THIS PRODUCT
                      </a>
                    </u>
                    <br />
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
                    {product.length && (
                      <span>
                        Dimension:(L) {product.length} ,(H) {product.height},
                        (W) {product.weight} <br />
                      </span>
                    )}
                    {product.compartment && (
                      <span>
                        Compartment: {product.compartment} <br />
                      </span>
                    )}
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Swiper>
          {product.videoLink &&
            product.videoLink.map((video, index) => {
              // Check if the link is a YouTube URL
              const isYouTube = video.includes("youtu");
              return (
                <SwiperSlide key={index}>
                  <div className="single-video">
                    {isYouTube ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          video.split("v=")[1] ||
                          video.split("/").pop().split("?")[0]
                        }?autoplay=1&loop=1&rel=0&playlist=${
                          video.split("v=")[1] ||
                          video.split("/").pop().split("?")[0]
                        }`}
                        title={`Video ${index}`}
                        className="img-fluid"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{ width: "100%", height: "300px" }}
                      />
                    ) : (
                      <video
                        src={video}
                        className="img-fluid"
                        controls
                        preload="metadata"
                        autoPlay
                        muted
                        loop
                        style={{ width: "100%", height: "auto" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  {/* Removed other components */}
                </SwiperSlide>
              );
            })}
        </Swiper>
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
                    <Nav.Link eventKey="productReviews">
                      Reviews({reviews.length})
                    </Nav.Link>
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
                        <li className="product-anotherinfo-list">
                          {product.length && (
                            <span>
                              Dimension: {product.length} <br />
                            </span>
                          )}
                        </li>
                        <li>
                          {product.width && (
                            <span>
                              Width: {product.width} <br />
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
                        <span>
                        Date of Manufacture:{" "}
                        {new Date(product.date).toLocaleDateString("en-GB")}{" "}
                        <br />
                      </span><br/>
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
                    <p className="des">{product.about}</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="productReviews">
                    <div className="row">
                      <div className="col-lg-7">
                        <div className="review-wrapper">
                          {loading ? (
                            <p>Loading reviews...</p>
                          ) : reviews.length === 0 ? (
                            <p>
                              No reviews yet. Be the first to review this
                              product!
                            </p>
                          ) : (
                            reviews.map((review) => (
                              <div className="single-review" key={review._id}>
                                <div className="review-img">
                                  {review.image && (
                                    <img
                                      src={`${URL}/images/${review.image}`}
                                      alt="Review"
                                      className="img-fluid"
                                    />
                                  )}
                                </div>

                                <div className="review-content">
                                  <div className="review-top-wrap">
                                    <div className="review-left">
                                      <div className="review-name">
                                        <h4>{review.customerId.name}</h4>
                                      </div>
                                      <div className="review-rating">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="review-bottom">
                                    <p>{review.review}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="ratting-form-wrapper pl-50">
                          <h3>Add a Review</h3>
                          <div className="ratting-form">
                            <form onSubmit={handleReviewSubmit}>
                              <div className="star-box">
                                <span>Your rating:</span>
                                <div className="ratting-star">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fa fa-star${
                                        star <= userRating ? "" : "-o"
                                      }`}
                                      onClick={() => setUserRating(star)}
                                      style={{
                                        cursor: "pointer",
                                        color:
                                          star <= userRating
                                            ? "#ffa900"
                                            : "#d3ced2",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="rating-form-style mb-10">
                                    <textarea
                                      placeholder="Your Review"
                                      value={reviewText}
                                      onChange={(e) =>
                                        setReviewText(e.target.value)
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="rating-form-style mb-10">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        setReviewImage(e.target.files[0])
                                      }
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    className="button"
                                    style={{
                                      backgroundColor: "black",
                                      color: "white",
                                      border: "none",
                                      padding: "10px 20px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Submit Review
                                  </button>
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
              <div className="col-6 col-sm-6 col-md-6 col-lg-3" key={index}>
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
                      <span>₹{data.price}.00</span>
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
      </LayoutOne>
    </Fragment>
  );
};

export default ProductView;
