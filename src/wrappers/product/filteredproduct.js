import { Link, useLocation } from "react-router-dom";
import { URL } from "../../helpers/handle_api";

const ShopGridFilter = () => {
  const location = useLocation();
  const filteredProducts = location.state?.filteredProducts || [];

  return (
    <div className="container">
      {filteredProducts.length > 0 ? (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-6 col-md-3 mb-4">
              <div className="product-item">
                 <Link
               to={`/productview/${product._id}`}>
                <img
                  src={`${URL}/images/${product.coverimage}`}
                  alt={product.title}
                  className="img-fluid"
                />
                </Link>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ShopGridFilter;
