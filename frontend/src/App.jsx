import './App.css'
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Footer from './components/Footer'
import ProductForm from './components/admin/AddProduct'
import { useLocation } from 'react-router-dom'
import AdminLayout from './components/admin/Layout'
import {Products} from './components/admin/Products'
import { AllProducts } from './components/admin/AllProducts'
import { Orders } from './components/admin/Orders'
import Dashboard from "./components/admin/Deshboard"
import toast, { Toaster } from "react-hot-toast"
import { EditProduct } from './components/admin/EditProduct'
import ProductDetails from './components/SingalProduct'


function App() {
  const location = useLocation()

  // paths where we want to hide navbar & footer
  

  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <div>
       <Toaster position="top-right" reverseOrder={false} />
      {!hideLayout && <Navbar />}
      <Routes>
        {/* User Side */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Admin Side */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="products" element={<Products />} >
            <Route index element={<AllProducts />} />
            <Route path="add" element={<ProductForm />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
