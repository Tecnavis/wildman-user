import { Link, useLocation } from "react-router-dom";
import { URL, fetchWishlist, createWishlist, fetchCustomerCart, createCustomerCart } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import ProductRating from "../../components/product/sub-components/ProductRating";
import ProductModal from "../../components/product/ProductModal";
import { useState } from "react";

const ShopGridFilter = () => {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const filteredProducts = location.state?.filteredProducts || [];

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

  const addToRecentlyViewed = (product) => {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const exists = recentlyViewed.find((item) => item._id === product._id);
    if (!exists) {
      recentlyViewed.unshift(product);
      if (recentlyViewed.length > 6) recentlyViewed.pop();
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalShow(true);
  };

  return (
    <div className="container">
      {filteredProducts.length > 0 ? (
        <div className="row">
          {filteredProducts.map((data, index) => (
            <div className="col-6 col-md-3 mb-4" key={index}>
              <div className="product-wrap">
                <div className="product-img">
                  <Link to={`/productview/${data._id}`} onClick={() => addToRecentlyViewed(data)}>
                    <img className="default-img" src={`${URL}/images/${data.coverimage}`} alt="" />
                    <img className="hover-img" src={`${URL}/images/${data.coverimage}`} alt="" />
                  </Link>
                  <div className="product-img-badges">
                    {data.discount && <span className="pink">-{data.discount}%</span>}
                    <span className="purple">New</span>
                  </div>
                  <div className="product-action">
                    <div className="pro-same-action pro-wishlist">
                      <button>
                        <a>
                          <i className="pe-7s-like" onClick={() => handleAddToWishlist(data)} />
                        </a>
                      </button>
                    </div>
                    <div className="pro-same-action pro-cart">
                      <button className="active" onClick={() => handleAddToCart(data)}>
                        Add To Cart
                      </button>
                    </div>
                    <div className="pro-same-action pro-quickview">
                      <button title="Quick View" onClick={() => handleQuickView(data)}>
                        <i className="pe-7s-look" />
                      </button>
                    </div>
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
                  <div className="product-rating">
                    <ProductRating ratingValue={data.rating} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
      <ProductModal show={modalShow} onHide={() => setModalShow(false)} product={selectedProduct} />
    </div>
  );
};

export default ShopGridFilter;
