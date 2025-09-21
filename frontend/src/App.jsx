import './App.css'
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import ProductForm from './components/admin/AddProduct'
import AdminLayout from './components/admin/Layout'
import {Products as AdminProductsPage} from './components/admin/Products'
import { AllProducts } from './components/admin/AllProducts'
import { Orders } from './components/admin/Orders'
import Dashboard from "./components/admin/Deshboard"
import toast, { Toaster } from "react-hot-toast"
import { EditProduct } from './components/admin/EditProduct'
import ProductDetails from './pages/SingalProduct'
import Cart from './pages/CartPage'
import ScrollToTop from './components/ScrollToTop'
import Products from "./pages/Products"
import NotFound from './pages/NotFound'
import Checkout from './pages/CheckoutPage'
import Profile from './pages/Profile'
import { ClerkProviderWrapper, SignInComponent, SignUpComponent } from './providers/ClerkProvider'

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* page content will render here */}
      <Footer />
    </>
  )
}

function App() {
  return (
    <ClerkProviderWrapper>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
        <ScrollToTop/>
        <Routes>
          {/* User Side */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={< Products/>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<SignInComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
          </Route>

          {/* Admin Side */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProductsPage />}>
              <Route index element={<AllProducts />} />
              <Route path="add" element={<ProductForm />} />
              <Route path="edit/:id" element={<EditProduct />} />
            </Route>
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
    </ClerkProviderWrapper>
  )
}

export default App
