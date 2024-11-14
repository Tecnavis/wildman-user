import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { fetchWishlist, URL, deleteWishlist as deleteWishlistAPI, createCustomerCart, fetchCustomerCart } from "../../helpers/handle_api";
import Swal from "sweetalert2";

const Wishlist = () => {
  let { pathname } = useLocation();
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
// Fetch wishlist
  useEffect(() => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (customerDetails) {
      fetchWishlist()
        .then((res) => {
          setWishlistItems(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
      setWishlistItems(guestWishlist);
    }
  }, []);
//delete wishlist
  const handleDeleteWishlist = (productId) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if (customerDetails) {
      // Handle backend delete for logged-in users
      deleteWishlistAPI(productId)
        .then(() => {
          setWishlistItems((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
          );
        })
        .catch((err) => console.log(err));
    } else {
      // Remove item from guestWishlist in local storage
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
      const updatedWishlist = guestWishlist.filter((item) => item._id !== productId);
      localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
    }
  };
//add to cart
const handleAddToCart = async (product) => {
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

  if (!customerDetails) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please log in to proceed to checkout.",
      confirmButtonText: "Login",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login-register"); 
      }
    });
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
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Wishlist", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems.length > 0 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Add To Cart</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((item) => (
                            <tr key={item._id}>
                              <td className="product-thumbnail">
                                <Link >
                                  <img
                                    className="img-fluid"
                                    src={`${URL}/images/${item.coverimage || item.productId.coverimage}`}
                                    alt=""
                                  />
                                </Link>
                              </td>
                              <td className="product-name text-center">
                                <Link>
                                  {item.mainCategory || item.productId.mainCategory}
                                </Link>
                              </td>
                              <td className="product-price-cart">
                                <span className="amount">{item.price || item.productId.price}</span>
                              </td>
                              <td className="product-wishlist-cart">
                                <button  className="active" onClick={() => handleAddToCart(item.productId)}>
                                  Add To Cart
                                </button>
                              </td>
                              <td className="product-remove">
                                <button onClick={() => handleDeleteWishlist(item._id)}>
                                  <i className="fa fa-times"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in wishlist <br />
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Add Items
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Wishlist;
