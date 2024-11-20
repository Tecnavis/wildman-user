import axios from "axios";
import Swal from 'sweetalert2';


// export const  URL = `${process.env.BASE_URL}`;


export const  URL = `http://localhost:3000`;
// export const  URL = `https://api.wildman.tecnavis.com`;

//fetch order product by customerId
export const fetchOrderProducts = async (customerId) => {
  try {
    const response = await fetch(`${URL}/customerorder/${customerId}`);
    if (!response.ok) throw new Error("Order not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching order products:", error);
    throw error;
  }
}
//fetch product details
export const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${URL}/product/${productId}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };
  
  
//fetch categories
export const fetchCategories = async () => {
    const response = await axios.get(`${URL}/category`);
    return response.data;
}
//fetchLogo
export const fetchLogo =async()=>{
    const response = await axios.get(`${URL}/logo`);
    return response.data;
}
//fetch admins
export const fetchAdmins = async () => {
    const response = await axios.get(`${URL}/admin`);
    return response.data;
}
//signup customer
export const createCustomer = async (data) => {
    try {
      const { data: response } = await axios.post(`${URL}/customer`, data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Customer created successfully",
      });
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "An error occurred", // Show the specific error message
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong",
        });
      }
    }
  };
//delete customer cart
export const deleteCustomerCart =async (id) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.delete(`${URL}/customercart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Cart Item Removed successfully",
      });
      return data;
    } catch (error) {
      console.error("Error deleting Cart Item:", error);
      throw error;
    }
  };

//get all customer cart of this customer
export const fetchCustomerCart = async () => {
    const token = localStorage.getItem("token");
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    const customerId = customerDetails._id;
    try {
      const { data } = await axios.get(`${URL}/customercart/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching customer cart:", error);
      throw error;
    }
  };
  
  //create customer cart
  export const createCustomerCart = async (data) => {
    try {
      const { data: response } = await axios.post(`${URL}/customercart`, data);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "An error occurred",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong, please try again later.",
        });
      }
      throw error;
    }
  }

//delete wishlist
export const deleteWishlist = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.delete(`${URL}/favorite/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Wishlist deleted successfully",
      });
      return data;
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      throw error;
    }
  };
//get all wishlist of this customer
export const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    const customerId = customerDetails._id;
    try {
      const { data } = await axios.get(`${URL}/favorite/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  };

//  createWishlist function
export const createWishlist = async (wishlistData) => {
    try {
      const { data: response } = await axios.post(`${URL}/favorite`, wishlistData);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "An error occurred",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong, please try again later.",
        });
      }
      throw error;
    }
  };
//sign in customer
export const signInCustomer = async (data) => {
      try {
        const { data: response } = await axios.post(`${URL}/customer/login`, data);
        localStorage.setItem("token", response.token);
        localStorage.setItem("customerDetails", JSON.stringify(response.customerDetails));
        return { success: true, message: "Login successful" };
      } catch (error) {
        if (error.response) {
          return { success: false, message: error.response.data.message || "Invalid email or password" };
        } else {
          return { success: false, message: "Something went wrong, please try again later." };
        }
      }
    };

//fetch all products
export const fetchProducts = async () => {
    const response = await axios.get(`${URL}/product`);
    return response.data;
}
//fetch all banner
export const fetchBanner = async () => {
    const response = await axios.get(`${URL}/banner`);
    return response.data;
}

