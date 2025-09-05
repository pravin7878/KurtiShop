import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
const navigate = useNavigate()

const handleViewProduct = (product) => {
    navigate(`/products/${product._id}`, { state: product });
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          src={product?.images?.[0] || "https://via.placeholder.com/300"}
          alt={product?.name || "Product"}
        />

        {/* Badge (optional: e.g. New or Sale) */}
        {product?.isNew && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
            New
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center px-4 py-5">
        <h3 className="text-lg font-semibold text-gray-800 truncate w-full">
          {product?.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{product?.brand}</p>

        {/* Price */}
        <p className="text-xl font-bold text-blue-600 mt-2">
          ₹{product?.price}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
          onClick={() => handleViewProduct(product)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 transition">
            View
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
