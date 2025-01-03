import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  fetchCustomerCart,
  URL,
  fetchCoupons,
  deleteCustomerCart,
} from "../../helpers/handle_api";
import Swal from "sweetalert2";
import "./style.scss";
const Cart = () => {
  const navigate = useNavigate();
  const [customerCart, setCustomerCart] = useState([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (customerDetails) {
      fetchCustomerCart()
        .then((res) => {
          const cartWithQuantity = res.map((item) => ({
            ...item,
            quantity: item.quantity || 1, // Use existing quantity or default to 1
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
        quantity: item.quantity || 1, // Use existing quantity or default to 1
      }));
      setCustomerCart(cartWithQuantity);
    }
    // fetchCoupons()
    //   .then((res) => {
    //     setCoupons(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  // Initialize selectedSizes with first available size for each product
  useEffect(() => {
    const initialSizes = {};
    customerCart.forEach((item) => {
      // If item already has a selected size, use it
      if (item.selectedSize) {
        initialSizes[item._id] = item.selectedSize;
      }
      // Otherwise use the first available size
      else if (item.sizes || (item.productId && item.productId.sizes)) {
        const sizes = item.sizes || item.productId.sizes;
        if (sizes && sizes.length > 0) {
          initialSizes[item._id] = sizes[0].size;
        }
      }
    });
    setSelectedSizes(initialSizes);
  }, [customerCart]);
  //increment quantity
  const [checkoutDetailss, setCheckoutDetails] = useState({
    totalQuantity: 0,
    totalAmount: 0,
    sizeDetails: {
      total: 0,
      discount: 0,
    },
  });
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
          setCustomerCart((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
          );
        })
        .catch((err) => console.log(err));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item._id !== productId);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCustomerCart(updatedCart);
    }
  };
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
    // All items will have a size due to auto-selection in useEffect
    const checkoutDetails = customerCart
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        productDetails: {
          id: item.productId?._id || item._id,
          color: item.color || item.productId?.color,
          title: item.title || item.productId?.title,
          mainCategory: item.mainCategory || item.productId?.mainCategory,
          subCategory: item.subCategory || item.productId?.subCategory,
          price: item.price || item.productId?.price,
          coverImage: item.coverimage || item.productId?.coverimage,
          discount: item.discount || item.productId?.discount,
          gst: item.gst || item.productId?.gst,
        },
        sizeDetails: {
          sizeId: item._id,
          size: selectedSizes[item._id],
          quantity: item.quantity,
          total: (item.price || item.productId?.price) * item.quantity || 0,
          discount: item.discount || item.productId?.discount,
        },
        sizeDetails: {
          sizeId: item._id,
          size: selectedSizes[item._id],
          quantity: item.quantity,
          totalProductprice:
            (item.price || item.productId?.price) * item.quantity || 0,
          discount: item.discount || item.productId?.discount || 0,
          total:
            ((item.price || item.productId?.price) * item.quantity || 0) *
            (1 - (item.discount || item.productId?.discount || 0) / 100),
        },
        totalQuantity,
        totalAmount,
      }));
    localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails));
    setIsOrderConfirmed(true);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Order confirmed!",
    });
  };
  const isConfirmOrderDisabled = calculateTotalQuantity === 0;
  const checkoutDetails = JSON.parse(
    localStorage.getItem("checkoutDetails")
  )?.[0] || {
    totalQuantity: 0,
    totalAmount: 0,
    sizeDetails: {
      total: 0,
      discount: 0,
    },
  };

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
  useEffect(() => {
    // Calculate updated checkout details
    const updatedCheckoutDetails = {
      totalQuantity: calculateTotalQuantity(),
      totalAmount: calculateTotalPrice(),
      sizeDetails: {
        total: calculateTotalPrice(),
        discount: calculateTotalDiscount(),
      },
    };
    setCheckoutDetails(updatedCheckoutDetails);
    // Optionally, update localStorage if needed
    localStorage.setItem(
      "checkoutDetails",
      JSON.stringify(updatedCheckoutDetails)
    );
  }, [customerCart, selectedSizes]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };
  const calculateTotalPrice = () => {
    return customerCart.reduce((total, item) => {
      const price = item.price || item.productId.price;
      const discount = item.discount || item.productId.discount || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return customerCart.reduce((totalDiscount, item) => {
      const price = item.price || item.productId.price;
      const discount = item.discount || item.productId.discount || 0;
      const discountAmount = price * (discount / 100) * item.quantity;
      return totalDiscount + discountAmount;
    }, 0);
  };

  const totalAmount = calculateTotalPrice();
  const totalDiscount = calculateTotalDiscount();
  // Function to get coupon for a specific product
  // const getProductCoupon = (productId) => {
  //   return coupons.find(
  //     (coupon) =>
  //       coupon.status === "active" &&
  //       coupon.products.some((product) => product._id === productId)
  //   );
  // };

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Wildman Premium - Your Ultimate Destination for Premium E-Commerce Shopping"
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
                                <Link
                                  to={`/productview/${
                                    item.productId._id || item._id
                                  }`}
                                >
                                  <img
                                    className="img-fluid"
                                    src={`${URL}/images/${
                                      item.coverimage ||
                                      item.productId.coverimage
                                    }`}
                                    alt=""
                                  />
                                </Link>
                                {/* {getProductCoupon(item.productId._id) && (
                                  <div className="coupon-section mt-2">
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center">
                                      <p className="font-medium">
                                        Coupon Available!
                                      </p>
                                      <p className="text-sm">
                                        Code:{" "}
                                        {
                                          getProductCoupon(item.productId._id)
                                            .code
                                        }
                                      </p>
                                      <p className="text-xs">
                                        Get{" "}
                                        {
                                          getProductCoupon(item.productId._id)
                                            .discount
                                        }
                                        % off
                                      </p>
                                    </div>
                                  </div>
                                )} */}
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
                                    {/* Show all sizes if no specific size was selected during add to cart */}
                                    {(item.selectedSize
                                      ? // If specific size was selected, show only that size
                                        [
                                          {
                                            _id: "selected",
                                            size: item.selectedSize,
                                          },
                                        ]
                                      : // Otherwise show all available sizes
                                        item.sizes ||
                                        item.productId?.sizes ||
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
                                  ₹.{" "}
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
                                ₹
                                {item.quantity *
                                  (item.price
                                    ? (
                                        item.price *
                                        (1 - (item.discount || 0) / 100)
                                      ).toFixed(2)
                                    : (
                                        item.productId.price *
                                        (1 -
                                          (item.productId.discount || 0) / 100)
                                      ).toFixed(2))}
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
                <div className="row" hidden={!isOrderConfirmed}>
                  {/* <div className="col-lg-6 col-md-12">
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
                  </div> */}
                  <div className="col-lg-12 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5 className="sub-total">
                        Total products{" "}
                        <span>{checkoutDetailss.totalQuantity}</span>
                      </h5>
                      <h5 className="sub-total">
                        MRP Price
                        <span>
                          ₹{" "}
                          {(checkoutDetailss.sizeDetails.total || 0) +
                            parseFloat(totalDiscount.toFixed(2))}
                        </span>
                      </h5>

                      <h5 className="sub-total">
                        Total Discount{" "}
                        <span>
                          -₹{totalDiscount.toFixed(2)} (
                          {(
                            (totalDiscount / (totalAmount + totalDiscount) ||
                              0) * 100
                          ).toFixed(2)}
                          %)
                        </span>
                      </h5>
                      <h5 className="sub-total">
                        Total Amount{" "}
                        <span>
                          ₹{checkoutDetailss.sizeDetails.total.toFixed(2) || 0}
                        </span>
                      </h5>
                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>
                          ₹{checkoutDetailss.totalAmount.toFixed(2) || 0}
                        </span>
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
