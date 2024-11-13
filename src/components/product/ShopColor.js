import PropTypes from "prop-types";

import { setActiveSort } from "../../helpers/product";
import { useEffect, useState } from "react";
import { URL } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import axios from "axios";

const ShopColor = ({  getSortParams }) => {
  const [colors, setColors] = useState([]); // State to store fetched colors

  // Fetch colors from the backend
  const fetchColors = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/color`); 
      setColors(response.data); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching colors!',
      });
    }
  };
  useEffect(() => {
    fetchColors(); 
  }, []);
  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Color </h4>
      <div className="sidebar-widget-list mt-20">
        {colors ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("color", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Colors{" "}
                </button>
              </div>
            </li>
            {colors.map((color, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={e => {
                        getSortParams("color", color);
                        setActiveSort(e);
                      }}
                    >
                      <span className="checkmark" /> {color.value}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No colors found"
        )}
      </div>
    </div>
  );
};

ShopColor.propTypes = {
  colors: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopColor;
