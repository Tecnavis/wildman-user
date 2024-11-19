import { useEffect, useState } from "react";
import { EffectFade, Thumbs } from "swiper";
import { Modal } from "react-bootstrap";
import Rating from "./sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import { createCustomerCart, createWishlist, fetchCustomerCart, fetchWishlist, URL } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import "./style.scss";

function ProductModal({ product, show, onHide }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantityCount, setQuantityCount] = useState(1);

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  useEffect(() => {
    setThumbsSwiper(null);
  }, [product]);
  if (!product) return null;
 //add to wishlist
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
    <Modal
      show={show}
      onHide={onHide}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton></Modal.Header>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="product-large-image-wrapper">
              <Swiper options={gallerySwiperParams}>
                <SwiperSlide>
                  <div className="single-image">
                    <img
                      src={`${URL}/images/${product.coverimage}`}
                      className="img-fluid"
                      alt="Product"
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="product-small-image-wrapper mt-15">
              <Swiper options={thumbnailSwiperParams}>
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="single-image">
                      <img
                        src={`${URL}/images/${image}`}
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="product-details-content quickview-content">
              <h5 className="des">{product.title}</h5>
              <h4 className="desc">{product.description}</h4>
              <div className="product-details-price" style={{display:"flex"}}>
                <span>RS. {product.price}</span> 
                {/* old price */}
              </div>
              <div className="pro-details-rating-wrap">
                <h5 className="return">RETURN POLICY IS AVAILABLE</h5>
              </div>
              <div className="pro-details-list">
                <p>{product.mainCategory}</p>
                <p>{product.subCategory}</p>
              </div>
              <div className="pro-details-color-wrap">
                <div className="pro-details-color-content">
                  <label
                    className={`pro-details-color-content--single ${product.color}`}
                  >
                    {/* <input type="radio" value={product.color} name="product-color" /> */}
                    <span className="color">Color: {product.color}</span>
                  </label>
                </div>
              </div>
              <br />
              <div className="pro-details-size-color">
                {product.sizes.map((size, index) => (
                  <div className="pro-details-size">
                    <div className="pro-details-size-content" key={index}>
                      <label className={`pro-details-size-content--single`} style={{backgroundColor:"black",color:"white"}}>
                        {/* <input type="radio" value={"M"} checked /> */}
                        <span className="size-name">{size.size}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pro-details-quality">
                <div className="cart-plus-minus">
                  <button
                    onClick={() =>
                      setQuantityCount(
                        quantityCount > 1 ? quantityCount - 1 : 1
                      )
                    }
                    className="dec qtybutton"
                  >
                    -
                  </button>
                  <input
                    className="cart-plus-minus-box"
                    type="text"
                    value={quantityCount}
                    readOnly
                  />
                  <button
                    onClick={() => setQuantityCount(quantityCount + 1)}
                    className="inc qtybutton"
                  >
                    +
                  </button>
                </div>
                <div className="pro-details-cart btn-hover">
                  <button onClick={() => handleAddToCart(product)}> Add To Cart </button>
                </div>
                <div className="pro-details-wishlist">
                  <button onClick={()=> handleAddToWishlist(product)}>
                      <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="pro-details-compare">
                  <button>
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductModal;
