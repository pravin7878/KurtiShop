// ProductDetails.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/cartSlice";


const ProductDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No product data found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-10 py-18">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Product Images */}
        <div>
         <div className="h-[400px] pb-5">
           <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg shadow-md mb-4"
          />
         </div>
          <div className="flex flex-wrap gap-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index}`}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 object-cover rounded-md border cursor-pointer transition-transform duration-200 ${selectedImage === img
                    ? "border-black scale-105"
                    : "border-gray-300 hover:scale-105"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.category}</p>
          <p className="text-2xl font-semibold text-black mb-6">
            ₹{product.price}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6 space-y-1 text-sm">
            <p>
              <span className="font-medium">Brand:</span> {product.brand}
            </p>
            <p>
              <span className="font-medium">In Stock:</span>{" "}
              {product.countInStock}
            </p>
            <p>
              <span className="font-medium">Rating:</span> {product.rating} ⭐ (
              {product.numReviews} reviews)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              className="bg-black cursor-pointer text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product.id,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                    qty: 1,
                    countInStock: product.countInStock,
                  })
                )
              }
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-400 px-6 py-3 cursor-pointer rounded-md hover:bg-gray-100 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
