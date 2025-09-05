import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

const backendUri = import.meta.env.VITE_BACKEND_URI;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUri}/api/products`);
        setProducts(res.data); 
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col py-12 bg-white px-5 md:px-12 lg:px-20">
      {/* Title */}
      <h3 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-800 text-center md:text-left">
        SHOP OUR FRESH NEW ITEMS
      </h3>

      {/* Responsive Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
