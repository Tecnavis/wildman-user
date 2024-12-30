import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, URL } from '../../helpers/handle_api';
import SectionTitle from '../../components/section-title/SectionTitle';

const Categories = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetchCategories().then((res) => {
      setCategory(res);
    });
  }, []); // Add an empty dependency array to avoid multiple calls to `fetchCategories`.

  return (
    <div className="container">
        <SectionTitle
                  titleText="All Categories"
                  positionClass="text-center"
                  spaceClass="mb-55"
                />
      <div className="row">
        {category.map((item) => (
          <div className="col-6 col-sm-6 col-md-6 col-lg-3" key={item.id}>
            <div className="product-wrap">
              <div className="product-img">
                <Link to={`/`}>
                  <img
                    className="default-img"
                    src={`${URL}/images/${item.image}`}
                    alt=""
                  />
                </Link>
              </div>
              <div className="product-content text-center">
                <div className="product-price">
                  {/* <span>₹780.00</span> */}
                </div>
                <div className="product-content text-center">
  <h5 className="des">
    <Link to={`/category/${item.name}`}>{item.name}</Link>
  </h5>
</div>

              </div>
            </div>
          </div>
        ))}
      </div>
      <br/><br/><br/>
    </div>
    
  );
};

export default Categories;
