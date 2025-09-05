// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Home, Package, ShoppingCart, Users, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin" }, 
    { name: "Products", icon: <Package size={18} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen p-5">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"} 
            className={({ isActive }) =>
              `flex items-center w-full px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
