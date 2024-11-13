import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../../helpers/handle_api";

const BlogFeaturedSingle = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Fetch recently viewed products from local storage
    const viewedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(viewedProducts);
  }, []);

  return (
    <div className="recently-viewed-section">
      {recentlyViewed.length > 0 ? (
        recentlyViewed.map((product, index) => (
          <div key={index} className="blog-wrap mb-30 scroll-zoom">
            <div className="blog-img">
              <Link to={`/product/${product.id}`}>
                <img src={`${URL}/images/${product.coverimage}`} alt={product.name} />
              </Link>
              <div className="blog-category-names">
                <span className="purple">{product.mainCategory}</span>
              </div>
            </div>
            <div className="blog-content-wrap">
              <div className="blog-content text-center">
                <h3>
                  <Link to={`/product/${product.id}`}>{product.subCategory} - ${product.price}</Link>
                </h3>
                <span> {product.title}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No recently viewed products</p>
      )}
    </div>
  );
};

BlogFeaturedSingle.propTypes = {
  recentlyViewed: PropTypes.array,
};

export default BlogFeaturedSingle;
