import { useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaCartPlus } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // hamburger icons
import { useSelector } from "react-redux";




function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
console.log(cartItems);


  const navLinks = [
    { path: "/shop", label: "Shop" },
    { path: "/new-arrivals", label: "New Arrivals" },
    { path: "/men", label: "Men" },
    { path: "/women", label: "Women" },
    { path: "/kids", label: "Kids" },
    { path: "/sale", label: "Sale" },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            DUGGU FASHION
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {navLinks.map((item, ind) => (
              <Link
                key={ind}
                to={item.path}
                className="hover:text-black transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="flex items-center gap-1 hover:text-black">
              <CgProfile size={20} />
              <span className="hidden md:block">Login</span>
            </Link>
            <button className="flex items-center gap-1 hover:text-black">
              <CiSearch size={20} />
              <span className="hidden md:block">Search</span>
            </button>
            {/* <Link to="/cart" className="relative">
              <FaCartPlus size={22} />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
                0
              </span>
            </Link> */}

            <div className="relative">
              <Link to="/cart"><FaCartPlus size={22} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-center gap-4 py-4">
            {navLinks.map((item, ind) => (
              <Link
                key={ind}
                to={item.path}
                className="text-gray-700 hover:text-black transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
