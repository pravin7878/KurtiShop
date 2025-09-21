import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdProductCard } from "./AdProductCard"
import toast from "react-hot-toast"

export const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`${backendUri}/api/products/${id}`)
      setProducts((prev) => prev.filter((product) => product._id !== id))
      setLoading(false)
      toast.success("Product Removed")
    } catch (err) {
      console.error("Delete error:", err)
      setError("Failed to delete product")
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
  navigate(`/admin/products/edit/${product._id}`, { state: { product } });
};


  const getProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${backendUri}/api/products`)
      setProducts(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to load products")
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div className="p-6">
      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-600 py-10">
          <span className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
          Loading products...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 py-10">{error}</div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
           <AdProductCard product={product} handleDelete={handleDelete} handleEdit={() => handleEdit(product)}/>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-500 text-center">No products found</p>
        )
      )}
    </div>
  )
}
