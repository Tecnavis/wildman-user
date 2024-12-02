import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import ProductModal from "../../components/product/ProductModal";
import { Link } from "react-router-dom";
import Rating from "../../components/product/sub-components/ProductRating";
import { URL, createWishlist, fetchProducts, fetchWishlist } from "../../helpers/handle_api";
import Swal from "sweetalert2";

const ProductGridList = () => {
  const [modalShow, setModalShow] = useState(false);
  const [products, setProducts] = useState([]);
//fetch all products
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        const sortedProducts = res.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProducts(sortedProducts);
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
      });
  }, []);
 //add to wishlist
 const handleAddToWishlist = async (product) => {
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
  if (!customerDetails) {
    // Handle guest user wishlist by using local storage
    let guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || []; 
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
  return (
    <Fragment>
      {products.map((item, index) => (
        <div className="col-xl-4 col-sm-6" key={index}>
          <Fragment>
            <div className="product-wrap">
              <div className="product-img">
                <Link to={`/product/${item.id}`}>
                  <img
                    className="default-img"
                    src={`${URL}/images/${item.coverimage}`}
                    alt=""
                  />
                  <img
                    className="hover-img"
                    src={`${URL}/images/${item.images[0]}`}
                    alt=""
                  />
                </Link>
                <div className="product-img-badges">
                {item.discount && <span className="pink">-{item.discount}%</span>}

                  {/* Show "New" badge on the 5 most recent products */}
                  {index < 5 && <span className="purple">New</span>}
                </div>

                <div className="product-action">
                  <div className="pro-same-action pro-wishlist">
                    <button>
                      <i className="pe-7s-like" onClick={() => handleAddToWishlist(item)} />
                    </button>
                  </div>
                  <div className="pro-same-action pro-cart">
                    <button>
                      <i className="pe-7s-cart"></i> Add To cart
                    </button>
                  </div>
                  <div className="pro-same-action pro-quickview">
                    <button
                      onClick={() => setModalShow(true)}
                      title="Quick View"
                    >
                      <i className="pe-7s-look" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="product-content text-center">
                <h3>
                  <Link to={`/product/${item.id}`}>{item.subCategory}</Link>
                </h3>
                <p>{item.mainCategory}</p>
                <div className="product-rating">
                  <Rating ratingValue={4} />
                </div>
                <div className="product-price">
                  <Fragment>
                    <span>₹{item.price}</span> 
                  </Fragment>
                </div>
              </div>
            </div>
          </Fragment>
          <br/>
        </div>
      ))}
     <ProductModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridList;
