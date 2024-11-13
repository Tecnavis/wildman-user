import ShopSidebar from "../../wrappers/product/ShopSidebar";

import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Paginator from "react-hooks-paginator";
import { getSortedProducts } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbarFilter from "../../wrappers/product/ShopTopbarFilter";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { fetchProducts } from "../../helpers/handle_api";

const ShopGridFilter = () => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const pageLimit = 9; 
  const { pathname } = useLocation();

  useEffect(() => {
    fetchProducts().then((res) => {
      setAllProducts(res);
    });
  }, []); 

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  useEffect(() => {
    let sorted = getSortedProducts(allProducts, sortType, sortValue);
    sorted = getSortedProducts(sorted, filterSortType, filterSortValue);
    setSortedProducts(sorted);
  }, [allProducts, sortType, sortValue, filterSortType, filterSortValue]);

  useEffect(() => {
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [offset, pageLimit, sortedProducts]);

  return (
    <Fragment>
      <SEO titleTemplate="Shop Page" description="Wild man | All Products " />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Shop", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <ShopSidebar
                  allProducts={allProducts}
                  getSortParams={getSortParams}
                  sideSpaceClass="mr-30"
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                <ShopTopbarFilter
                  getLayout={getLayout}
                  getFilterSortParams={getFilterSortParams}
                  productCount={allProducts.length}
                  sortedProductCount={currentData.length}
                  allProducts={allProducts}
                  getSortParams={getSortParams}
                />

                <ShopProducts layout={layout} products={currentData} />

                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ShopGridFilter;
