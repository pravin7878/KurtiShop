import React from 'react'

export const AdProductCard = ({product,handleDelete,handleEdit}) => {
    return (
        <div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col"
        >
            {/* Image with zoom effect */}
            <div className="overflow-hidden rounded-t-xl">
                <img
                    src={product.images?.[0] || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="h-48 w-full object-cover transform hover:scale-105 transition duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-gray-800">
                    {product.name}
                </h3>
                <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
                <p className="text-sm text-gray-500">{product.brand}</p>

                {/* Buttons */}
                <div className="mt-auto flex gap-2 pt-4">
                    <button
                        onClick={() => handleEdit(product)} 
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
