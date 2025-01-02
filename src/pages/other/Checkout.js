import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useForm } from "../../helpers/useForm";
import Swal from "sweetalert2";
import { URL, fetchCoupons } from "../../helpers/handle_api";
import axios from "axios";
import "./style.scss";
////all sett
const Checkout = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isGiftWrapping, setIsGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [coupons, setCoupons] = useState([]);
  const cartItems = JSON.parse(localStorage.getItem("checkoutDetails")) || [];
  const TotalAmount = cartItems.length > 0 ? cartItems[0].totalAmount : 0;
  const navigate = useNavigate();
  const [appliedCoupons, setAppliedCoupons] = useState({});
  const [code, setCode] = useState("");
  const customer = JSON.parse(localStorage.getItem("customerDetails")) || {};
  const selectedProduct = JSON.parse(
    localStorage.getItem("checkoutDetails")
  ) || { selectedProducts: [], totalAmount: 0, totalQuantity: 0 };
  const GIFT_WRAP_PRICE = 30; // Gift wrapping price
  const calculateGSTAmount = (item) => {
    const baseAmount = item.sizeDetails.total;
    return (baseAmount * item.productDetails.gst) / 100;
  };
  const [showCouponInput, setShowCouponInput] = useState(true);
  // Function to calculate total amount including discounts and GST
  const calculateTotal = () => {
    let subtotal = 0;
    let totalGST = 0;

    cartItems.forEach((item) => {
      const discountedAmount = calculateDiscountedAmount(item);
      subtotal += discountedAmount;
      totalGST += calculateGSTAmount(item);
    });

    const giftWrapCost = isGiftWrapping ? GIFT_WRAP_PRICE : 0;
    return (subtotal + totalGST + giftWrapCost).toFixed(2);
  };

  // Modified getProductCoupon function
  const getProductCoupon = (productId) => {
    console.log("Checking for product ID:", productId);
    console.log("Available coupons:", coupons);

    const foundCoupon = coupons.find(
      (coupon) =>
        coupon.status === "active" &&
        coupon.products.some(
          (product) => product === productId || product._id === productId
        )
    );

    console.log("Found coupon:", foundCoupon);
    return foundCoupon;
  };

  // Modified handleApplyCoupon function
  const handleApplyCoupon = (e, productId) => {
    e.preventDefault();
    console.log("Attempting to apply coupon with code:", code);
    console.log("For product ID:", productId);

    // Find coupon that matches the entered code
    const matchingCoupon = coupons.find((coupon) => {
      console.log("Checking coupon:", coupon.code);
      console.log("Coupon products:", coupon.products);

      return (
        coupon.code === code &&
        coupon.status === "active" &&
        coupon.products.some((product) => {
          const productIdString =
            typeof product === "object" ? product._id : product;
          const compareId = productId.toString();
          console.log("Comparing:", productIdString, "with:", compareId);
          return productIdString === compareId;
        })
      );
    });

    console.log("Matching coupon found:", matchingCoupon);

    if (matchingCoupon) {
      setAppliedCoupons((prev) => {
        const newState = {
          ...prev,
          [productId]: true,
        };
        console.log("New applied coupons state:", newState);
        return newState;
      });

      setCode("");
      setShowCouponInput(false);

      Swal.fire({
        icon: "success",
        title: "Coupon Applied",
        text: `Discount of ${matchingCoupon.discount}% has been applied!`,
      });
    } else {
      console.log("No matching coupon found");
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "Please enter a valid coupon code.",
      });
    }
  };

  // Modified calculateDiscountedAmount function
  const calculateDiscountedAmount = (item) => {
    const baseAmount = item.sizeDetails.total;
    console.log("Calculating discount for item:", item);
    console.log("Base amount:", baseAmount);

    const coupon = getProductCoupon(item.productDetails.id);
    console.log("Found coupon for discount calculation:", coupon);

    if (coupon && appliedCoupons[item.productDetails.id]) {
      const discountAmount = (baseAmount * coupon.discount) / 100;
      console.log("Applying discount:", discountAmount);
      return baseAmount - discountAmount;
    }
    return baseAmount;
  };
  const [values, handleChange, setValues] = useForm({
    customerName: "",
    address: "",
    phone: "",
    email: "",
    Pincode: "",
    totalAmount: TotalAmount + (isGiftWrapping ? GIFT_WRAP_PRICE : 0),
    deliveryStatus: "Pending",
    orderDate: new Date(),
    deliveryDate: "",
    note: "",
    products: selectedProduct,
    customerId: customer._id || "",
  });
  // Payment status logic
  useEffect(() => {
    const updatedBalanceAmount = values.totalAmount - values.paidAmount;
    let paymentStatus = "Unpaid";

    if (updatedBalanceAmount === 0) {
      paymentStatus = "Paid";
    } else if (updatedBalanceAmount === values.totalAmount) {
      paymentStatus = "Unpaid";
    } else {
      paymentStatus = "Partially Paid";
    }

    setValues((prevValues) => ({
      ...prevValues,
      balanceAmount: updatedBalanceAmount,
      paymentStatus: paymentStatus,
    }));
  }, [values.paidAmount, values.totalAmount, setValues]);

  // Delivery status logic
  useEffect(() => {
    if (values.deliveryStatus === "Delivered") {
      setValues((prevValues) => ({
        ...prevValues,
        deliveryDate: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        deliveryDate: "Not Delivered",
      }));
    }
    fetchCoupons()
      .then((res) => {
        setCoupons(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [values.deliveryStatus, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    const requiredFields = [
      "customerName",
      "address",
      "phone",
      "email",
      "Pincode",
    ];
    const missingFields = requiredFields.filter((field) => !values[field]);

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill out all required billing fields before confirming.",
      });
      return;
    }
    if (!selectedPaymentMethod) {
      Swal.fire("Select Payment", "Please select a payment method.", "warning");
      return;
    }
    if (selectedPaymentMethod === "Razorpay") {
      await initiatePayment();
    }

    try {
      // Calculate final total amount
      const finalAmount = parseFloat(calculateTotal());
      // Prepare order data with explicit gift fields and discounted total
      const orderData = {
        ...values,
        totalAmount: finalAmount,
        gift: isGiftWrapping,
        giftMessage: isGiftWrapping ? giftMessage : "",
        appliedCoupons: appliedCoupons, // Store which coupons were applied
      };

      const response = await axios.post(`${URL}/customerorder`, orderData);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Order Created",
          text: "Order created successfully.",
        });
        localStorage.removeItem("checkoutDetails");
        navigate("/shop-grid-filter");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the order.",
      });
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate Razorpay Payment
  const initiatePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      Swal.fire("Failed to load payment gateway. Please try again.");
      return;
    }
    // Calculate final amount in paise (Razorpay requires amount in paise)
    const finalAmount = Math.round(parseFloat(calculateTotal()) * 100);

    const orderResponse = await axios.post(`${URL}/razorpay`, {
      amount: finalAmount,
      currency: "INR",
    });
    if (orderResponse.status !== 200) {
      Swal.fire("Error", "Failed to create order. Please try again.", "error");
      return;
    }

    const { amount, id: order_id, currency } = orderResponse.data;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount.toString(),
      currency,
      name: "Wild man",
      description: "Purchase",
      order_id,
      handler: async (response) => {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };

        const validateResponse = await axios.post(`${URL}/razorpay`, data);
        if (validateResponse.data.success) {
          Swal.fire("Success", "Payment successful", "success");
        } else {
          Swal.fire("Error", "Payment verification failed", "error");
        }
      },
      prefill: {
        name: values.customerName,
        email: values.email,
        contact: values.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmits = async (e) => {
    e.preventDefault();
    if (selectedPaymentMethod === "Razorpay") {
      await initiatePayment();
      handleSubmit();
    } else {
      console.log("Payment method:", selectedPaymentMethod);
    }
  };
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
        titleTemplate="Checkout"
        description="Wildman Premium - Your Ultimate Destination for Premium E-Commerce Shopping"
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Checkout", path: "/checkout" },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="billing-info mb-20">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="customerName"
                            value={values.customerName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Address</label>
                          <input
                            type="text"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Total Amount</label>
                          <input
                            className="billing-address"
                            placeholder="0000"
                            type="number"
                            value={TotalAmount || 0}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input
                            type="text"
                            name="Pincode"
                            value={values.Pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input
                            type="number"
                            name="phone"
                            onChange={handleChange}
                            value={values.phone}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <h4>Additional information</h4>
                      <div className="additional-info">
                        <label>Order notes</label>
                        <textarea
                          placeholder="Notes about your order, e.g. special notes for delivery. "
                          name="note"
                          defaultValue={""}
                          value={values.note}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {/* gift wrapping available */}
                    <div className="additional-info">
                      <input
                        type="checkbox"
                        name="gift"
                        style={{ width: "6%", height: "14px" }}
                        checked={isGiftWrapping}
                        onChange={() => setIsGiftWrapping(!isGiftWrapping)}
                      />
                      <label>
                        Gift wrapping available (+ ₹{GIFT_WRAP_PRICE})
                      </label>
                    </div>

                    {/* Conditional rendering of gift message input */}
                    {isGiftWrapping && (
                      <div className="gift-message-section mb-20">
                        <label>Gift Message</label>
                        <textarea
                          placeholder="Enter your gift message (optional)"
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          maxLength={200}
                        />
                      </div>
                    )}

                    {/* Modify order total section to include gift wrap price */}
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="checkout-container">
                          <div className="col-lg-12">
                            <div className="">
                              {/* Order Summary */}
                              <div className="">
                                <div className="checkout-section">
                                  <p>Select payment method</p>
                                  <div className="order-details">
                                    <div
                                      onClick={() =>
                                        setSelectedPaymentMethod("COD")
                                      }
                                      className={`order-item ${
                                        selectedPaymentMethod === "COD"
                                          ? "selected-cod"
                                          : ""
                                      }`}
                                    >
                                      <input
                                        type="text"
                                        className="item-input"
                                        value="Cash on Delivery"
                                        readOnly
                                      />
                                    </div>
                                    <div
                                      onClick={() =>
                                        setSelectedPaymentMethod("Razorpay")
                                      }
                                      className={`order-item ${
                                        selectedPaymentMethod === "Razorpay"
                                          ? "selected-razorpay"
                                          : ""
                                      }`}
                                    >
                                      <input
                                        type="text"
                                        className="item-input"
                                        value="Razor Pay"
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          {cartItems.map((item, index) => (
                            <ul key={index}>
                              <li>
                                <span className="order-middle-left">
                                  <img
                                    src={`${URL}/images/${item.productDetails.coverImage}`}
                                    style={{
                                      width: "60px",
                                      marginRight: "10px",
                                    }}
                                    alt={item.productDetails.title}
                                  />
                                  {item.productDetails.mainCategory} X{" "}
                                  {item.sizeDetails.quantity}
                                </span>
                                <span className="order-price">
                                  ₹{item.sizeDetails.total.toFixed(2)}
                                </span>
                              </li>
                            </ul>
                          ))}

                          {/* Single coupon input for all products */}
                          {showCouponInput && (
                            <div className="coupon-section mt-2">
                              <div className="discount-code-wrapper">
                                <div className="discount-code">
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const productId =
                                        cartItems[0]?.productDetails.id;
                                      if (productId) {
                                        handleApplyCoupon(e, productId);
                                        setShowCouponInput(false);
                                      }
                                    }}
                                  >
                                    <input
                                      type="text"
                                      required
                                      value={code}
                                      onChange={(e) => setCode(e.target.value)}
                                      placeholder="Enter coupon code"
                                    />
                                    <button
                                      className="cart-btn-2"
                                      type="submit"
                                    >
                                      Apply Coupon
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="your-order-bottom">
                          <ul style={{ marginBottom: "10px" }}>
                            <li className="your-order-shipping">
                              <p>Sub Total</p>
                            </li>
                            <li>
                              ₹
                              {cartItems
                                .reduce(
                                  (acc, item) =>
                                    acc + calculateDiscountedAmount(item),
                                  0
                                )
                                .toFixed(2)}
                            </li>
                          </ul>
                          <ul style={{ marginBottom: "10px" }}>
                            <li className="your-order-shipping">
                              <p>Total GST</p>
                            </li>
                            <li>
                              ₹
                              {cartItems
                                .reduce(
                                  (acc, item) => acc + calculateGSTAmount(item),
                                  0
                                )
                                .toFixed(2)}
                            </li>
                          </ul>

                          {isGiftWrapping && (
                            <ul>
                              <li className="your-order-shipping">
                                <p>Gift Wrapping</p>
                              </li>
                              <li>₹{GIFT_WRAP_PRICE}</li>
                            </ul>
                          )}

                          <ul>
                            <li className="your-order-shipping">
                              <p>GST</p>
                            </li>
                            <li>
                              {cartItems.reduce(
                                (acc, item) => acc + item.productDetails.gst,
                                0
                              )}
                              %
                            </li>
                          </ul>
                        </div>
                        {/* <div className="your-order-total"> */}
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>₹{calculateTotal()}</li>
                          </ul>
                          {/* </div> */}
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25">
                      <div className="place-order mt-25">
                        <button
                          className="btn-hover"
                          onClick={handleSubmits}
                          hidden
                        >
                          Do Payment
                        </button>
                        <br />
                      </div>
                      <button className="btn-hover" onClick={handleSubmit}>
                        Confirm Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Shop Now
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

export default Checkout;
