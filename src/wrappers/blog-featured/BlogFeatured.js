import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "../../components/section-title/SectionTitle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { URL } from "../../helpers/handle_api";

const BlogFeatured = ({ spaceTopClass, spaceBottomClass }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Fetch recently viewed products from local storage
    const viewedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(viewedProducts);
  }, []);

  return (
    <div className={clsx("blog-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <SectionTitle
          titleText="RECENTLY VIEWED PRODUCTS"
          positionClass="text-center"
          spaceClass="mb-55"
        />
        <div className="row">
          {recentlyViewed.length > 0 ? (
            recentlyViewed.map((product, index) => (
              <div key={index} className="col-lg-4 col-sm-6 mb-30">
                <div className="blog-wrap scroll-zoom">
                  <div className="blog-img">
                    <Link to={`/productview/${product._id}`}>
                      <img src={`${URL}/images/${product.coverimage}`} alt={product.name} />
                    </Link>
                    <div className="blog-category-names">
                      <span className="purple">{product.mainCategory}</span>
                    </div>
                  </div>
                  <div className="blog-content-wrap">
                    <div className="blog-content text-center">
                      <h3>
                        <Link to={`/productview/${product._id}`}>
                          {product.subCategory} - ${product.price}
                        </Link>
                      </h3>
                      <span>{product.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recently viewed products</p>
          )}
        </div>
      </div>
    </div>
  );
};

BlogFeatured.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BlogFeatured;
