import { Link } from "react-router-dom";

// components/Header.jsx
const Header = ({ title }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <Link className="hover:underline" to={"/"}>Visit Store</Link>
        <span className="font-medium text-gray-700">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Admin"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Header;
