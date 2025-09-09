import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/cartSlice";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewProduct = (product) => {
    navigate(`/products/${product._id}`, { state: product });
  };

  return (
    <div className="flex flex-col p-4 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div onClick={() => handleViewProduct(product)} className="cursor-pointer">
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            className="w-full h-full object-cover rounded-md transform hover:scale-105 transition-transform duration-500"
            src={product?.images?.[0] || "https://via.placeholder.com/300"}
            alt={product?.name || "Product"}
          />

          {/* Badge (optional: e.g. New or Sale) */}
          {product?.isNew && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md">
              New
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 px-1">
          <h3 className="text-base sm:text-md font-semibold text-gray-800 truncate w-full">
            {product?.name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{product?.brand}</p>

          {/* Price */}
          <p className="text-lg sm:text-xl font-bold text-blue-600 mt-2">
            ₹{product?.price}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:px-6 justify-between mt-4">
        <button
          onClick={() => { }}
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer text-sm hover:bg-gray-900 transition"
        >
          Buy
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-lg text-sm hover:bg-blue-700 transition"
          onClick={() =>
            dispatch(
              addToCart({
                ...product,
                qty: 1,
              })
            )
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
