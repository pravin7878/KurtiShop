import React, { useState, useEffect } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'

const ProductForm = ({ initialData = null, onSubmit }) => {
  const [imageUrls, setImageUrls] = useState(initialData?.images || [])
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
    images: [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setImageUrls(initialData.images || [])
    }
  }, [initialData])

  // Upload Images
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const imgForm = new FormData()
    files.forEach((file) => imgForm.append("images", file))

    try {
      setUploading(true)
      const { data } = await axios.post(`${BACKEND_URI}/api/upload`, imgForm, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const updatedImageUrls = [...imageUrls, ...data.imageUrls]
      setImageUrls(updatedImageUrls)
      setFormData((prev) => ({ ...prev, images: updatedImageUrls }))
      setUploading(false)
      e.target.value = ""
    } catch (error) {
      console.error("Image Upload Error:", error)
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleRemoveImage = (urlToRemove) => {
    const updatedImageUrls = imageUrls.filter((url) => url !== urlToRemove)
    setImageUrls(updatedImageUrls)
    setFormData((prev) => ({ ...prev, images: updatedImageUrls }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
      images: imageUrls,
    }

    if (onSubmit) {
      await onSubmit(payload)
    } else {
      // Default: Create product
      try {
        await axios.post(`${BACKEND_URI}/api/products`, payload)
        toast.success(" Product added successfully!")
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          countInStock: "",
          images: [],
        })
        setImageUrls([])
      } catch (error) {
        console.error("Product creation failed:", error)
      }
    }
  }

  return (
    <div className=" mt-10 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={4}
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Stock Quantity</label>
            <input
              type="number"
              name="countInStock"
              placeholder="Stock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              min="0"
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full px-2 py-2 border rounded-lg bg-gray-50"
            accept="image/*"
          />

          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}

          <div className="flex flex-wrap gap-3 mt-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  className="rounded-lg border shadow-md w-28 h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-black cursor-pointer text-white text-xs px-1.5 font-bold py-0.5 rounded-full opacity-80 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={uploading || !formData.name || !formData.price || imageUrls.length === 0}
          type="submit"
          className={`w-full py-3 px-4 font-semibold rounded-lg transition duration-200 cursor-pointer ${
            uploading || !formData.name || !formData.price || imageUrls.length === 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {initialData ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  )
}

export default ProductForm
