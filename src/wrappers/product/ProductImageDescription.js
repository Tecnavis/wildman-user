import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductDetails, URL } from "../../helpers/handle_api";
import ProductRating from "../../components/product/sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import LayoutOne from "../../layouts/LayoutOne";
import SEO from "../../components/seo";
import { Breadcrumb } from "react-bootstrap";

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
                    <span className="pink">-5%</span>
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
                          <div className="single-image col-4 p-2" key={idx}>
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
                  <h2>{product.mainCategory}</h2>
                  <div className="product-details-price">
                    <span>${product.price}</span>
                  </div>
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <ProductRating ratingValue={4} />
                    </div>
                  </div>
                  <div className="pro-details-list">
                    <p>{product.description}</p>
                  </div>

                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <span>Color</span>
                      <div className="pro-details-color-content">
                        <label
                          className={`pro-details-color-content--single `}
                        >
                          <span className="checkmark"> {product.color}</span>
                        </label>
                      </div>
                    </div>
                    {product.sizes.map((size) => (
                    <div className="pro-details-size" key={size._id}>
                      <div className="pro-details-size-content" >
                        <label className={`pro-details-size-content--single`}>
                          <input type="radio" value={"M"} />
                          <span className="size-name"> {size.size}</span>
                        </label>
                      </div>
                      
                    </div>
                    ))}
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
                        <Link to="/shop-grid-standard">{product.subCategory}</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="pro-details-meta">
                    <span>Title :</span>
                    <ul>
                      <li>
                        <Link to="/shop-grid-standard">{product.title}</Link>
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
