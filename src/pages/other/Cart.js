import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { fetchCustomerCart, URL, deleteCustomerCart } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import "./style.scss";

const Cart = () => {
  const navigate = useNavigate();
  const [customerCart, setCustomerCart] = useState([]);

  useEffect(() => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (customerDetails) {
      fetchCustomerCart()
        .then((res) => {
          const cartWithQuantity = res.map((item) => ({
            ...item,
            quantity: 1, // initialize with default quantity of 1
          }));
          setCustomerCart(cartWithQuantity);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const cartWithQuantity = guestCart.map((item) => ({
        ...item,
        quantity: 1, // initialize with default quantity of 1
      }));
      setCustomerCart(cartWithQuantity);
    }
  }, []);
//increment quantity
  const incrementQuantity = (productId) => {
    setCustomerCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
//decrement quantity
  const decrementQuantity = (productId) => {
    setCustomerCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
//delete cart items
  const handleDeleteCustomer = (productId) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if (customerDetails) {
      deleteCustomerCart(productId)
        .then(() => {
          setCustomerCart((prevItems) => prevItems.filter((item) => item._id !== productId));
        })
        .catch((err) => console.log(err));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item._id !== productId);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCustomerCart(updatedCart);
    }
  };
  //calculate total amount
  const calculateTotalPrice = () => {
    return customerCart.reduce((total, item) => {
      return total + (item.price || item.productId.price) * item.quantity;
    }, 0);
  };
  const totalAmount = calculateTotalPrice();

   //  calculate total quantity of purchased items
const calculateTotalQuantity = () => {
  return customerCart.reduce((total, item) => total + item.quantity, 0);
};
const totalQuantity = calculateTotalQuantity();
//confirmed orders
const handleConfirmOrder = () => {

  if (totalQuantity === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Cart is empty",
    });
    return;
  }
  const checkoutDetails = customerCart
    .filter((item) => item.quantity > 0) 
    .map((item) => ({
      productDetails: {
        id: item._id,
        color: item.color || item.productId.color,
        title: item.title || item.productId.title,
        mainCategory: item.mainCategory || item.productId.mainCategory,
        subCategory: item.subCategory || item.productId.subCategory,
        price: item.price || item.productId.price,
        coverImage: item.coverimage || item.productId.coverimage,
      },
      sizeDetails: {
        sizeId: item._id,
        size: selectedSizes[item._id] || item.size, 
        quantity: item.quantity,
        total: (item.price || item.productId.price) * item.quantity,
      },
      totalQuantity,
      totalAmount,
    }));

  localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails));
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Order confirmed!",
  })
};

const isConfirmOrderDisabled = calculateTotalQuantity === 0;
const checkoutDetails = JSON.parse(localStorage.getItem("checkoutDetails"))?.[0] || {};

const handleProceedToCheckout = () => {
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
  } else {
    navigate("/checkout"); 
  }
};
const [selectedSizes, setSelectedSizes] = useState({});
const handleSizeSelect = (productId, size) => {
  setSelectedSizes((prev) => ({
    ...prev,
    [productId]: size,
  }));
};
  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Cart", path: "/cart" },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {customerCart.length > 0 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th></th>
                            <th>Sizes</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerCart.map((item) => (
                            <tr key={item._id}>
                              <td className="product-thumbnail">
                                <Link to="">
                                  <img
                                    className="img-fluid"
                                    src={`${URL}/images/${
                                      item.coverimage ||
                                      item.productId.coverimage
                                    }`}
                                    alt=""
                                  />
                                </Link>
                              </td>
                              <td className="product-name">
                                <Link to="">
                                  {item.mainCategory ||
                                    item.productId.mainCategory}
                                </Link>
                                <p>{item.color || item.productId.color}</p>
                              </td>
                              <td>
                                <div className="cart-item-variation">
                                  <div className="flex gap-2 mt-2">
                                    {(
                                      item.sizes ||
                                      item.productId.sizes ||
                                      []
                                    ).map((sizeItem) => (
                                      <button
                                        style={{ marginLeft: "2px" }}
                                        key={sizeItem._id}
                                        onClick={() =>
                                          handleSizeSelect(
                                            item._id,
                                            sizeItem.size
                                          )
                                        }
                                        className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 border border-gray-400 shadow-sm ${
                                          selectedSizes[item._id] ===
                                          sizeItem.size
                                            ? "bg-gray-100 text-red border-red-500"
                                            : "bg-white hover:bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {sizeItem.size}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td className="product-price-cart">
                                <span className="amount">
                                  RS.{" "}
                                  {item.price
                                    ? (
                                        item.price *
                                        (1 - (item.discount || 0) / 100)
                                      ).toFixed(2)
                                    : (
                                        item.productId.price *
                                        (1 -
                                          (item.productId.discount || 0) / 100)
                                      ).toFixed(2)}
                                </span>
                              </td>

                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <button
                                    className="dec qtybutton"
                                    onClick={() => decrementQuantity(item._id)}
                                  >
                                    -
                                  </button>
                                  <input
                                    className="cart-plus-minus-box"
                                    type="text"
                                    value={item.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="inc qtybutton"
                                    onClick={() => incrementQuantity(item._id)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                $
                                {(item.price || item.productId.price) *
                                  item.quantity}
                              </td>
                              <td className="product-remove">
                                <button
                                  onClick={() => handleDeleteCustomer(item._id)}
                                >
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
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to="/shop-grid-standard">Continue Shopping</Link>
                      </div>
                      <div className="cart-clear">
                        <button
                          onClick={handleConfirmOrder}
                          disabled={isConfirmOrderDisabled}
                        >
                          Confirm Order
                        </button>
                      </div>
                      <div className="cart-clear">
                        <button>Clear Shopping Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5 className="sub-total">
                        Total products{" "}
                        <span>{checkoutDetails.totalQuantity || 0}</span>
                      </h5>
                      <h5 className="sub-total">
                        Total Amount{" "}
                        <span>${checkoutDetails.totalAmount || 0}.00</span>
                      </h5>
                      <h5 className="sub-total">
                        Discount <span>${5}.00</span>
                      </h5>
                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>${checkoutDetails.totalAmount - 5 || 0}.00</span>
                      </h4>
                      <button
                        className="checkoutbtn"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />
                      <Link to="/shop-grid-standard">Shop Now</Link>
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

export default Cart;
