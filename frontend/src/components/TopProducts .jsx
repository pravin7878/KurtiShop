import React from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import LoadingCard from "./LoadingProductCard";

const TopProducts = () => {
  const { isLoading: loading, error = {}, products = [] } = useSelector(
    (state) => state.products
  );
  const { isErr, message } = error;
  const topProducts = [...products].reverse().slice(0, 4);

  if (isErr) {
    return (
      <section className="my-10 px-4 sm:px-6 md:px-12 flex flex-col items-center text-center">
        <img
          src="/empty-box.svg"
          alt="Error"
          className="w-28 h-28 sm:w-40 sm:h-40 mb-4"
        />
        <p className="text-gray-700 text-base sm:text-lg">
          We couldn’t load fresh items right now.
        </p>
        <p className="text-sm text-gray-500">Please check back later.</p>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col justify-center my-10 px-4 sm:px-6 md:px-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        SHOP OUR FRESH NEW ITEMS
      </h2>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, ind) => (
            <LoadingCard key={ind} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopProducts;
