import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ShopTopActionFilter from "../../components/product/ShopTopActionFilter";

const ShopTopbar = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <ShopTopActionFilter
        getLayout={getLayout}
        getFilterSortParams={getFilterSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
        products={products}
        getSortParams={getSortParams}
      />
    </Fragment>
  );
};


export default ShopTopbar;
