import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCustomerCart, fetchCustomerCart, URL } from "../../../helpers/handle_api";

const MenuCart = () => {
  const [customerCart, setCustomerCart] = useState([]);

  useEffect(() => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (customerDetails) {
      fetchCustomerCart()
        .then((res) => {
          setCustomerCart(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCustomerCart(guestCart);
    }
  }, []);
//delete cart
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
    const updatedWishlist = guestCart.filter(
      (item) => item._id !== productId
    );
    localStorage.setItem("guestCart", JSON.stringify(updatedWishlist));
    setCustomerCart(updatedWishlist);
  }
};
  return (
    <div className="shopping-cart-content">
      {customerCart.length > 0 ? (
        <Fragment>
          <ul>

          {customerCart.map((item) => (
                <li className="single-shopping-cart" key={item._id || item.productId._id} >
                  <div className="shopping-cart-img">
                    <Link to="/product/1">
                      <img
                        alt=""
                        src={`${URL}/images/${item.coverimage ||item.productId.coverimage }`}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link
                        to="/product/1"
                      >
                        {item.mainCategory || item.productId.mainCategory}
                      </Link>
                    </h4>
                    <h6>Qty: 1</h6>
                    <span>
                      ${item.price || item.productId.price}
                    </span>
                      <div className="cart-item-variation">
                        <span>Color: {item.color || item.productId.color}</span>
                      </div>
                  </div>
                  <div className="shopping-cart-delete">
                    <button >
                      <i className="fa fa-times-circle"  onClick={() => handleDeleteCustomer(item._id || item.productId._id)}/>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to="/cart">
              view cart
            </Link>
          </div>
        </Fragment>
    ) : (
        <p className="text-center">No items added to cart</p>
    )}
    </div>
  );
};

export default MenuCart;
