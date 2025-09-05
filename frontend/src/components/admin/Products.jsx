import React, { useState } from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"

export const Products = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Detect current route
  const isAddPage = location.pathname.includes("/admin/products/add")
  const isEditPage = location.pathname.includes("/admin/products/edit")

  // Dynamic heading & button text
  let heading = "All Products"
  let buttonText = "+ Add New Product"
  let buttonAction = () => navigate("add")

  if (isAddPage) {
    heading = "Add Product"
    buttonText = "← Back to Products"
    buttonAction = () => navigate("/admin/products")
  } else if (isEditPage) {
    heading = "Edit Product"
    buttonText = "← Back to Products"
    buttonAction = () => navigate("/admin/products")
  }

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <button
          onClick={buttonAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer"
        >
          {buttonText}
        </button>

      </div>

      {/* Nested routes render here */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  )
}
