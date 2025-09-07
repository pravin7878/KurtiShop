// src/components/LoadingCard.jsx
import React from "react";

const LoadingCard = () => {
  return (
    <div className="border rounded-2xl shadow-md p-4 w-full max-w-sm animate-pulse">
      {/* Image placeholder */}
      <div className="h-50 bg-gray-300 rounded-lg mb-4"></div>

      {/* Title placeholder */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Price placeholder */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

      {/* Buttons placeholder */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-300 rounded w-1/2"></div>
        <div className="h-10 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default LoadingCard;
