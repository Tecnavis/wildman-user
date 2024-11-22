import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { signInCustomer, createCustomer } from "../../helpers/handle_api";
import { useForm } from "../../helpers/useForm";
import Swal from "sweetalert2";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [values, handleChange] = useForm({
    email: '',
    password: ''
  });
  const [data, handleChanges] = useForm({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await signInCustomer(values);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Customer logged in successfully",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message || "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "An unexpected error occurred during login. Please try again.",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!data.name || !data.email || !data.password || !data.phone) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields",
      });
      return;
    }
  
    try {
      const response = await createCustomer(data);
      
      console.log("Registration response:", response);
  
      // Check if we got a valid response with _id (indicating successful creation)
      if (response && response._id) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
        });
        navigate("/login-register");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response?.message || "Email or Phone already exists",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: "An unexpected error occurred during registration. Please try again.",
      });
    }
  };

  // Rest of your component code remains the same, but let's add some validation to the register form
  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Wildman Premium - Your Ultimate Destination for Premium E-Commerce Shopping"
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb 
          pages={[
            { label: "Home", path: "/" },
            { label: "Login Register" }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                              />
                              <input
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to="/">Forgot Password?</Link>
                                </div>
                                <button type="submit" onClick={handleLogin}>
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChanges}
                                placeholder="Username"
                                required
                              />
                              <input
                                name="email"
                                value={data.email}
                                onChange={handleChanges}
                                placeholder="Email"
                                type="email"
                                required
                              />
                              <input
                                name="phone"
                                value={data.phone}
                                onChange={handleChanges}
                                placeholder="Phone"
                                type="tel"
                                required
                              />
                              <input
                                type="password"
                                value={data.password}
                                onChange={handleChanges}
                                name="password"
                                placeholder="Password"
                                required
                              />
                              <div className="button-box">
                                <button type="submit" onClick={handleRegister}>
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;