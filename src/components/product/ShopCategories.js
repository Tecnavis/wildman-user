import { setActiveSort } from "../../helpers/product";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../helpers/handle_api";

const ShopCategories = ({ getSortParams }) => {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    fetchCategories().then((res) => {
      setCategory(res);
      // console.log(res, "jjj");
    });
  }, []);

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories </h4>
      <div className="sidebar-widget-list mt-30">
        {category ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={(e) => {
                    getSortParams("category", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Categories
                </button>
              </div>
            </li>
            {category.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      // onClick={(e) => {
                      //   getSortParams("category", category.name);
                      //   setActiveSort(e);
                      // }}
                    >
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
  );
};

export default ShopCategories;
