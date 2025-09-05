// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const pageTitle = location.pathname.split("/").pop() || "Dashboard";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header title={pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1) === "Admin" ? "Dashboard" : pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} />
        <div className="p-6">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
