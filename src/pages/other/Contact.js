import { Fragment, useEffect, useState } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import GoogleMap from "../../components/google-map";
import axios from "axios";
import { URL, fetchAdmins } from "../../helpers/handle_api";

const Contact = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetchAdmins().then((res) => {
      setAdmins(res);
    });
  }, []);

  const filterMainadmin = admins.find((admin) => admin.role === "Main Admin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filterMainadmin) {
      setFormMessage("Main Admin not found.");
      return;
    }

    try {
      await axios.post(`${URL}/admin/send-email`, {
        to: filterMainadmin.email,
        ...formData
      });
      setFormMessage("Message sent successfully!");
    } catch (error) {
      setFormMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Contact"
        description="Wildman Premium - Your Ultimate Destination for Premium E-Commerce Shopping"
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb 
          pages={[
            { label: "Home", path: "/" },
            { label: "Contact", path: "/contact" }
          ]}
        />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="contact-map mb-10">
              <GoogleMap lat={47.444} lng={-122.176} />
            </div>
            <div className="custom-row-2">
              {filterMainadmin && (
                <div className="col-12 col-lg-4 col-md-5" key={filterMainadmin._id}>
                  <div className="contact-info-wrap">
                    <div className="single-contact-info">
                      <div className="contact-icon">
                        <i className="fa fa-phone" />
                      </div>
                      <div className="contact-info-dec">
                        <p>+91 {filterMainadmin.phone}</p>
                        <p>+91 {filterMainadmin.phone}</p>
                      </div>
                    </div>
                    <div className="single-contact-info">
                      <div className="contact-icon">
                        <i className="fa fa-globe" />
                      </div>
                      <div className="contact-info-dec">
                        <p>
                          <a href={`mailto:${filterMainadmin.email}`}>
                            {filterMainadmin.email}
                          </a>
                        </p>
                        <p>
                          <a href={filterMainadmin.facebook}>
                            {filterMainadmin.facebook}
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="single-contact-info">
                      <div className="contact-icon">
                        <i className="fa fa-map-marker" />
                      </div>
                      <div className="contact-info-dec">
                        <p>{filterMainadmin.address}</p>
                      </div>
                    </div>
                    <div className="contact-social text-center">
                      <h3>Follow Us</h3>
                      <ul>
                        <li>
                          <a href={filterMainadmin.facebook}>
                            <i className="fa fa-facebook" />
                          </a>
                        </li>
                        <li>
                          <a href={filterMainadmin.instagram}>
                            <i className="fa fa-instagram" />
                          </a>
                        </li>
                        <li>
                          <a href={filterMainadmin.whatsapp}>
                            <i className="fa fa-whatsapp" />
                          </a>
                        </li>
                        <li>
                          <a href={filterMainadmin.youtube}>
                            <i className="fa fa-youtube" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-12 col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Get In Touch</h2>
                  </div>
                  <form className="contact-form-style" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <input 
                          name="name" 
                          placeholder="Name*" 
                          type="text" 
                          value={formData.name} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="col-lg-6">
                        <input 
                          name="email" 
                          placeholder="Email*" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="col-lg-12">
                        <input 
                          name="subject" 
                          placeholder="Subject*" 
                          type="text" 
                          value={formData.subject} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder="Your Message*"
                          value={formData.message}
                          onChange={handleChange}
                        />
                        <button className="submit" type="submit">
                          SEND
                        </button>
                      </div>
                    </div>
                  </form>
                  {formMessage && <p className="form-message">{formMessage}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Contact;
