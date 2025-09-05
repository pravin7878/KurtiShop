// pages/Dashboard.jsx
import StatCard from "./StatCard ";
import RecentActivity from "./RecentActivity";
import { Package, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const activities = [
    { message: "New product added: iPhone 15", time: "2h ago" },
    { message: "Order #1234 placed", time: "5h ago" },
    { message: "User John Doe registered", time: "1d ago" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Products" value="120" icon={<Package size={24} />} />
        <StatCard title="Orders" value="58" icon={<ShoppingCart size={24} />} />
        <StatCard title="Users" value="300" icon={<Users size={24} />} />
      </div>
      <RecentActivity activities={activities} />
    </div>
  );
};

export default Dashboard;
