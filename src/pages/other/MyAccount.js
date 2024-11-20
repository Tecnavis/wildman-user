import React from 'react';
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { URL, fetchOrderProducts } from "../../helpers/handle_api";

const MyAccount = () => {
  let { pathname } = useLocation();
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
        if (!customerDetails || !customerDetails._id) {
          console.error("No customer details found");
          return;
        }

        const response = await fetchOrderProducts(customerDetails._id);
        console.log("API Response:", response); // Debug log

        // Check if response.orders exists and is an array
        const orders = response.orders || response;
        const ordersArray = Array.isArray(orders) ? orders : [];
        
        console.log("Processed Orders:", ordersArray); // Debug log
        setOrderProducts(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "My Account", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Order Details
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper mb-4">
                            <h4>All Orders</h4>
                          </div>

                          {orderProducts.length === 0 ? (
                            <div className="text-center py-4">
                              <h5>No orders found</h5>
                              <p>You haven't placed any orders yet.</p>
                            </div>
                          ) : (
                            orderProducts.map((order, index) => (
                              <div key={order._id || index} className="border rounded p-4 mb-4">
                                <div className="row">
                                  <div className="col-md-6">
                                    <h5>Order #{order.orderId}</h5>
                                    <p className="text-muted">
                                      {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="col-md-6 text-md-end">
                                    <div className="mb-2">
                                      <span className="badge bg-primary me-2">
                                        {order.orderStatus}
                                      </span>
                                      <span className="badge bg-info">
                                        {order.paymentStatus}
                                      </span>
                                    </div>
                                    <h6>Total: ₹{order.totalAmount}</h6>
                                  </div>
                                </div>

                                <div className="border-top pt-3 mt-3">
                                  {order.products && order.products.map((product, productIndex) => (
                                    <div key={productIndex} className="row mb-3">
                                      <div className="col-md-3">
                                        <img
                                          src={`${URL}/images/${product.productDetails.coverImage}`}
                                          alt={product.productDetails.title}
                                          className="img-fluid rounded"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/assets/img/default-product.jpg";
                                          }}
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <h6>{product.productDetails.title}</h6>
                                        <p className="mb-1">
                                          {product.productDetails.mainCategory} - {product.productDetails.subCategory}
                                        </p>
                                        <p className="mb-1">
                                          Size: {product.sizeDetails.size} | 
                                          Quantity: {product.sizeDetails.quantity}
                                        </p>
                                        <p className="text-muted mb-0">
                                          Color: {product.productDetails.color}
                                        </p>
                                      </div>
                                      <div className="col-md-3 text-md-end">
                                        <h6>₹{product.productDetails.price * product.sizeDetails.quantity}</h6>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="border-top pt-3 mt-3">
                                  <h6 className="mb-3">Delivery Details</h6>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p className="mb-1"><strong>Name:</strong> {order.customerName}</p>
                                      <p className="mb-1"><strong>Address:</strong> {order.address}</p>
                                      <p className="mb-1"><strong>PIN:</strong> {order.Pincode}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <p className="mb-1"><strong>Phone:</strong> {order.phone}</p>
                                      <p className="mb-1"><strong>Payment:</strong> {order.paymentMethod}</p>
                                      <p className="mb-1"><strong>Delivery:</strong> {order.deliveryStatus}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit" className="btn btn-primary">
                                Continue Shopping
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;