import PropTypes from "prop-types";

import { setActiveSort } from "../../helpers/product";
import { useEffect, useState } from "react";
import { URL } from "../../helpers/handle_api";
import axios from "axios";
import Swal from "sweetalert2";

const ShopSize = ({  getSortParams }) => {
  const [sizes, setSizes] = useState([]); 

  // Fetch sizes from the backend
  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/size`); 
      setSizes(response.data); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching sizes!',
      });
    }
  };
  useEffect(() => {
    fetchSizes(); 
  }, []);
  return (
    <div className="sidebar-widget mt-40">
      <h4 className="pro-sidebar-title">Size </h4>
      <div className="sidebar-widget-list mt-20">
        {sizes ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("size", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Sizes{" "}
                </button>
              </div>
            </li>
            {sizes.map((size, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      className="text-uppercase"
                    >
                      {" "}
                      <span className="checkmark" />
                      {size.value}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No sizes found"
        )}
      </div>
    </div>
  );
};

ShopSize.propTypes = {
  getSortParams: PropTypes.func,
  sizes: PropTypes.array
};

export default ShopSize;
