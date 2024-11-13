import clsx from "clsx";
import {
  getIndividualCategories,
  getIndividualColors,
  getProductsIndividualSizes
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";

const ShopSidebar = ({ allproducts, getSortParams, sideSpaceClass }) => {
 
  const uniqueCategories = getIndividualCategories(allproducts);
  const uniqueColors = getIndividualColors(allproducts);
  const uniqueSizes = getProductsIndividualSizes(allproducts);

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch />

      {/* filter by categories */}
      <ShopCategories
        categories={uniqueCategories}
        // getSortParams={getSortParams}
      />

      {/* filter by color */}
      <ShopColor colors={uniqueColors} getSortParams={getSortParams} />

      {/* filter by size */}
      <ShopSize sizes={uniqueSizes} getSortParams={getSortParams} />
    </div>
  );
};

export default ShopSidebar;
