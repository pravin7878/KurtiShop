import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProductForm from "./AddProduct";
import toast from "react-hot-toast";

export const EditProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState("");

  console.log(product);
  
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${backendUri}/api/products/${id}`);
          setProduct(data);
        } catch (err) {
          console.log(err);
          
          setError("Failed to load product details");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  const handleUpdate = async (updatedProduct) => {
    try {
      await axios.put(`${backendUri}/api/products/${id}`, updatedProduct);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update product");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </div>
  );
};
