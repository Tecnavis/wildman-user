import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useForm } from "../../helpers/useForm";
import Swal from "sweetalert2";
import { URL } from "../../helpers/handle_api";
import axios from "axios";
import "./style.css";

const Checkout = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const cartItems = JSON.parse(localStorage.getItem("checkoutDetails")) || [];
  const TotalAmount = cartItems.length > 0 ? cartItems[0].totalAmount : 0;
 const navigate =useNavigate();
  const customer = JSON.parse(localStorage.getItem("customerDetails")) || {};
  const selectedProduct = JSON.parse(
    localStorage.getItem("checkoutDetails")
  ) || { selectedProducts: [], totalAmount: 0, totalQuantity: 0 };

  // Check if selectedProduct and selectedProducts array are defined and contain items
  const filteredProducts =
    Array.isArray(selectedProduct.selectedProducts) &&
    selectedProduct.selectedProducts.length > 0
      ? selectedProduct.selectedProducts.map((product) => ({
          productDetails: {
            id: product.productDetails?.id || "",
            mainCategory: product.productDetails?.mainCategory || "",
            subCategory: product.productDetails?.subCategory || "",
            color: product.productDetails?.color || "",
            price: product.productDetails?.price || 0,
            coverImage: product.productDetails?.coverimage || "",
            title: product.productDetails?.title || "",
          },
          sizeDetails: {
            sizeId: product.sizeDetails?.sizeId || "",
            size: product.sizeDetails?.size || 0,
            quantity: product.sizeDetails?.quantity || 0,
            total: product.sizeDetails?.totalAmount || 0,
          },
        }))
      : [];

  const [values, handleChange, setValues] = useForm({
    customerName: "",
    address: "",
    phone: "",
    email: "",
    Pincode: "",
    totalAmount: TotalAmount || 0,
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
  }, [values.deliveryStatus, setValues]);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
    // Validation for required fields
    const requiredFields = ["customerName", "address", "phone", "email", "Pincode"];
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
      const response = await axios.post(`${URL}/customerorder`, values);
      
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

    const orderResponse = await axios.post(`${URL}/razorpay`, {
      amount: values.totalAmount * 100,
      currency: "INR",
    });

    if (orderResponse.status !== 200) {
      Swal.fire("Error", "Failed to create order. Please try again.", "error");
      return;
    }

    const { amount,id: order_id,  currency } = orderResponse.data;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount.toString(),
      currency,
      name: "Wild man",
      description: "Purchase",
      order_id,
      handler: async (response) => {
        const data = {
          // razorpay_order_id: response.razorpay_order_id,
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

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of flone react minimalist eCommerce template."
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
                      <div className="col-lg-12 col-md-6">
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
                          <ul>
                            {cartItems.map((item, index) => (
                              <li key={index}>
                                <span className="order-middle-left">
                                  <img
                                    src={`${URL}/images/${item.productDetails.coverImage}`}
                                    style={{
                                      width: "60px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  {item.productDetails.mainCategory} X{" "}
                                  {item.sizeDetails.quantity}
                                </span>{" "}
                                <span className="order-price">
                                  ${item.sizeDetails.total.toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              $
                              {cartItems
                                .reduce(
                                  (acc, item) => acc + item.sizeDetails.total,
                                  0
                                )
                                .toFixed(2)}
                            </li>
                          </ul>
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
                 Do  Payment
                </button>
                                <br/>
                              </div>
                      <button className="btn-hover" onClick={handleSubmit} >
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
