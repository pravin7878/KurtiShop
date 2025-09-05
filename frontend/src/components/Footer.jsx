import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  const footerLinks = [
    { path: "/shop", label: "Shop" },
    { path: "/story", label: "Our Story" },
    { path: "/gift", label: "The Gift Guide" },
    { path: "/giftcard", label: "Gift Card" },
    { path: "/contact", label: "Contact Us" },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <footer className="bg-black text-white px-6 py-10 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Logo</h2>
          <p className="text-gray-300 text-sm">
            Discover premium clothing crafted with style and comfort.  
            Your fashion journey starts here.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          {footerLinks.map((item, ind) => (
            <Link
              key={ind}
              to={item.path}
              className="text-gray-300 hover:text-white text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Newsletter & Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-black w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>

          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" className="hover:text-gray-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-gray-400">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Your Clothing Brand. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
