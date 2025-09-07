import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/actions/product";
import LoadingCard from "../components/LoadingProductCard";

function Products() {
  const dispatch = useDispatch();
  const { isLoading: loading, error: { isErr, message }, products } = useSelector(
    (state) => state.products
  );

  // Local states for filters/search/sort/pagination
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [visibleCount, setVisibleCount] = useState(8); // initial products to show

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products by search
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting logic
  if (sort === "low-to-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "high-to-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    filteredProducts = [...filteredProducts].reverse(); // assuming latest are at the end
  }

  // Pagination (slice products)
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (isErr) {
    return (
      <div className="text-center text-red-500 py-10 font-semibold">
        {message}
      </div>
    );
  }

  return (
    <div className="flex flex-col py-12 bg-white px-5 md:px-12 lg:px-20 mt-14">
      {/* Title */}
      <h3 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-800 text-center md:text-left">
        SHOP OUR FRESH NEW ITEMS
      </h3>

      {/* Filters + Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, ind) => (
            <LoadingCard key={ind} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20">
          <img src="/empty-box.svg" alt="No products" className="w-40 h-40 mb-4" />
          <p className="text-gray-600">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {!loading && filteredProducts.length > visibleCount && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
