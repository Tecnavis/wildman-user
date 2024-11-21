import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { URL, fetchOrderProducts } from "../../helpers/handle_api";

const MyAccount = () => {
  const { pathname } = useLocation();
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
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
                                    <h5
                                      style={{ fontWeight: "bold", cursor: "pointer" }}
                                      onClick={() => handleShowModal(order)}
                                    >
                                      Order # {order.orderId}
                                    </h5>
                                    <p className="text-muted">
                                      Order Date {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="col-md-6 text-md-end">
                                    <div className="mb-2">
                                      <span className="badge bg-primary me-2">
                                        {order.deliveryStatus}
                                      </span>
                                    </div>
                                    <h6 style={{color:"red"}}>Total: ₹{order.totalAmount}</h6>
                                  </div>
                                </div>

                                <div className="border-top pt-3 mt-3">
                                  {order.products &&
                                    order.products.map((product, productIndex) => (
                                      <div key={productIndex} className="row mb-3">
                                        <div className="col-md-2">
                                          <Link to={`/productview/${product.productDetails.id}`}>
                                          <img
                                            src={`${URL}/images/${product.productDetails.coverImage}`}
                                            alt={product.productDetails.title}
                                            className="img-fluid rounded"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = "/assets/img/default-product.jpg";
                                            }}
                                          />
                                          </Link>
                                        </div>
                                        <div className="col-md-6">
                                          <h6>{product.productDetails.title}</h6>
                                          <p className="mb-3">
                                            {product.productDetails.mainCategory} -{" "}
                                            {product.productDetails.subCategory}
                                          </p>
                                          <p className="mb-1">
                                            Size: {product.sizeDetails.size} | Quantity:{" "}
                                            {product.sizeDetails.quantity}
                                          </p>
                                          <p className="text-muted mb-0">
                                            Color: {product.productDetails.color}
                                          </p>
                                        </div>
                                        <div className="col-md-3 text-md-end">
                                          <div className="d-flex justify-content-end">
                                            <button className="btn btn-secondary me-2" style={{height:"fit-content" }}>
                                              Return
                                            </button>
                                            <button className="btn btn-success" style={{height:"fit-content" }}>
                                              Reorder
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
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
