import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { URL } from "../../helpers/handle_api";
import SectionTitle from "../../components/section-title/SectionTitle";

const CategoryBasedProducts = () => {
  const { categoryName } = useParams(); // Extract category name from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${URL}/product/category/products?category=${categoryName}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching category products:", error);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container">
      <SectionTitle
        titleText={`Products in "${categoryName}"`}
        positionClass="text-center"
        spaceClass="mb-55"
      />
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-6 col-sm-6 col-md-6 col-lg-3" key={product.productId}>
              <div className="product-wrap">
                <div className="product-img">
                  <Link to={`/productview/${product._id}`}>
                  <img
                    className="default-img"
                    src={`${URL}/images/${product.coverimage}`}
                    alt={product.title}
                  />
                  </Link>
                </div>
                <div className="product-content text-center">
                  <h5 className="des">{product.title}</h5>
                  <div className="product-price">₹{product.price}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryBasedProducts;
