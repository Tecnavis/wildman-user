import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { URL, fetchOrderProducts } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import axios from "axios";

const MyAccount = () => {
  const { pathname } = useLocation();
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleReturnClick = (productId) => {
    // const returnMessage = `Return requested for Shop: ${shopName}, Product ID: ${productId}`;
    axios
      .post(`${URL}/notification/return-request`, { productId })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Return Requested",
          text: response.data.message,
        });
      })
      .catch((error) => {
        console.error("Error saving return request:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the return request.",
        });
      });
  };

  const isReturnDisabled = (status) => {
    return ["Returned", "Cancelled"].includes(status);
  };
  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "green" };
      case "Returned":
        return { color: "red" };
      case "Cancelled":
        return { color: "red" };
      case "Out for delivery":
        return { color: "orange" };
      case "On transist":
        return { color: "blue" };
      case "Pending":
        return { color: "gray" };
      default:
        return { color: "black" };
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerDetails = JSON.parse(
          localStorage.getItem("customerDetails")
        );
        if (!customerDetails || !customerDetails._id) {
          console.error("No customer details found");
          return;
        }

        const response = await fetchOrderProducts(customerDetails._id);
        const orders = response.orders || response;
        setOrderProducts(Array.isArray(orders) ? orders : []);
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
      <SEO titleTemplate="My Account" description="My Account page." />
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
                  <Accordion defaultActiveKey="2">
                    <Accordion.Item
                      eventKey="0"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>My Account Information</h4>
                            <h5>Your Personal Details</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>First Name</label>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Last Name</label>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Email Address</label>
                                <input type="email" />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Telephone</label>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Fax</label>
                                <input type="text" />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit">Continue</button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                      eventKey="2"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> Order Details
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
                              <div
                                key={order._id || index}
                                className="border rounded p-4 mb-4"
                              >
                                <div className="row">
                                  <div className="col-md-6">
                                    <h5
                                      style={{
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleShowModal(order)}
                                    >
                                      Order # {order.orderId}
                                    </h5>
                                    <p className="text-muted">
                                      Order Date{" "}
                                      {new Date(
                                        order.orderDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="col-md-6 text-md-end">
                                    <div className="mb-2">
                                      <span className="badge bg-primary me-2">
                                        {order.deliveryStatus}
                                      </span>
                                    </div>
                                    <h6 style={{ color: "red" }}>
                                      Total: ₹{order.totalAmount}
                                    </h6>
                                  </div>
                                </div>

                                <div className="border-top pt-3 mt-3">
                                  {order.products &&
                                    order.products.map(
                                      (product, productIndex) => (
                                        <div
                                          key={productIndex}
                                          className="row mb-3"
                                        >
                                          <div className="col-md-2">
                                            <Link
                                              to={`/productview/${product.productDetails.id}`}
                                            >
                                              <img
                                                src={`${URL}/images/${product.productDetails.coverImage}`}
                                                alt={
                                                  product.productDetails.title
                                                }
                                                className="img-fluid rounded"
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src =
                                                    "/assets/img/default-product.jpg";
                                                }}
                                              />
                                            </Link>
                                          </div>
                                          <div className="col-md-6">
                                            <h6>
                                              {product.productDetails.title}
                                            </h6>
                                            <p className="mb-3">
                                              {
                                                product.productDetails
                                                  .mainCategory
                                              }{" "}
                                              -{" "}
                                              {
                                                product.productDetails
                                                  .subCategory
                                              }
                                            </p>
                                            <p className="mb-1">
                                              Size: {product.sizeDetails.size} |
                                              Quantity:{" "}
                                              {product.sizeDetails.quantity}
                                            </p>
                                            <p className="text-muted mb-0">
                                              Color:{" "}
                                              {product.productDetails.color}
                                            </p>
                                            <span
                                              style={getStatusStyle(
                                                order.deliveryStatus
                                              )}
                                            >
                                              The product has been{" "}
                                              {order.deliveryStatus}!
                                            </span>
                                          </div>
                                          <div className="col-md-3 text-md-end">
                                            <div className="d-flex justify-content-end">
                                              <button
                                                className={`btn btn-danger me-2 ${
                                                  isReturnDisabled(
                                                    order.deliveryStatus
                                                  )
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleReturnClick(
                                                    order.orderId
                                                  )
                                                }
                                                disabled={isReturnDisabled(
                                                  order.deliveryStatus
                                                )}
                                              >
                                                Return
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                              </div>
                            ))
                          )}
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

      {/* Modal for Shipping Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Shipping Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p className="mb-1">{selectedOrder.customerName}</p>
              <p className="mb-1">{selectedOrder.address}</p>
              <p className="mb-1">{selectedOrder.Pincode}(Pin)</p>
              <p className="mb-1">
                {selectedOrder.phone} <br />
                {selectedOrder.email}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default MyAccount;
