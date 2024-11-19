import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "../../components/product/sub-components/ProductRating";
import ProductModal from "../../components/product/ProductModal";
import {
  fetchProducts,
  URL,
  createWishlist,
  fetchWishlist,
  createCustomerCart as addCartItems,
  fetchCustomerCart,
} from "../../helpers/handle_api";
import Swal from "sweetalert2";
import "./style.scss";

const ProductGridSingle = () => {
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
        setProducts(shuffledProducts.slice(0, 6));
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
      });
  }, []);

  // Store guest wishlist and cart in the database upon login
  const transferGuestDataToDatabase = async () => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) return;

    const guestWishlist =
      JSON.parse(localStorage.getItem("guestWishlist")) || [];
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    try {
      if (guestWishlist.length > 0) {
        for (const product of guestWishlist) {
          const wishlistData = {
            productId: product._id,
            customerId: customerDetails._id,
          };
          await createWishlist(wishlistData);
        }
        localStorage.removeItem("guestWishlist");
      }

      if (guestCart.length > 0) {
        for (const product of guestCart) {
          const cartData = {
            productId: product._id,
            customerId: customerDetails._id,
          };
          await addCartItems(cartData);
        }
        localStorage.removeItem("guestCart");
      }
    } catch (error) {
      console.log("Error transferring guest data to database:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  useEffect(() => {
    transferGuestDataToDatabase();
  }, []); // This should run once after login if customerDetails exists

  // Add to wishlist function
  const handleAddToWishlist = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if (!customerDetails) {
      // Handle guest user wishlist using local storage
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

  // Add to cart function
  const handleaddToCart = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if (!customerDetails) {
      // Handle guest user cart using local storage
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // Check if the product is already in the guest cart
      const isProductInGuestCart = guestCart.some(
        (item) => item._id === product._id
      );

      if (isProductInGuestCart) {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
        });
        return;
      }

      // Add product to guest cart
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
      const cartResponse = await fetchCustomerCart();
      const existingCart = cartResponse || [];

      // Check if the product is already in the user's cart
      const isProductInCart = existingCart.some(
        (item) => item.productId._id === product._id
      );

      if (isProductInCart) {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
        });
        return;
      }

      // Add product to the user's cart in the backend
      const cartData = {
        productId: product._id,
        customerId: customerDetails._id,
      };
      await addCartItems(cartData);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart.",
      });
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };
  // Add to recently viewed function
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

  return (
    <Fragment>
      <div className="product-grid-container">
        {products.map((data, index) => (
          <div className="product-wrap" key={index}>
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
              {data.discount && <span className="pink">-{data.discount}%</span>}

              </div>
              <div className="product-action">
                <div className="pro-same-action pro-wishlist">
                  <button>
                    <a>
                      <i
                        className="pe-7s-like"
                        onClick={() => handleAddToWishlist(data)}
                      />
                    </a>
                  </button>
                </div>
                <div className="pro-same-action pro-cart">
                  <button
                    className="active"
                    onClick={() => handleaddToCart(data)}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="pro-same-action pro-quickview">
                  <button
                    title="Quick View"
                    onClick={() => handleQuickView(data)}
                  >
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
                <Rating ratingValue={4} />
              </div>
              
            </div>
          </div>
        ))}
      </div>
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={selectedProduct}
      />{" "}
    </Fragment>
  );
};

export default ProductGridSingle;
