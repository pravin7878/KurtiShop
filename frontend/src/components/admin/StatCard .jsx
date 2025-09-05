// components/StatCard.jsx
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex items-center space-x-4">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
