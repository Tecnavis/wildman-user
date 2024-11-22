import clsx from "clsx";
import { useEffect, useState } from "react";
import { fetchCategories, URL } from "../../helpers/handle_api";
import Swal from "sweetalert2";
import axios from "axios";

const ShopSidebar = () => {

  const [category, setCategory] = useState([]);
  useEffect(() => {
    fetchCategories().then((res) => {
      setCategory(res);
    });
  }, []);
  const [colors, setColors] = useState([]); 

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
    <div className={clsx("sidebar-style",)}>
      {/*  search */}
      <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Search </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" action="#">
          <input type="text" placeholder="Search here..." />
          <button>
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>

      {/* filter by categories */}
      <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories </h4>
      <div className="sidebar-widget-list mt-30">
        {category ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button>
                  <span className="checkmark" /> All Categories
                </button>
              </div>
            </li>
            {category.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button>
                      <span className="checkmark" /> {category.name}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>

      {/* filter by color */}
      <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Color </h4>
      <div className="sidebar-widget-list mt-20">
        {colors ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button >
                  <span className="checkmark" /> All Colors{" "}
                </button>
              </div>
            </li>
            {colors.map((color, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button>
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
    </div>
  );
};

export default ShopSidebar;
