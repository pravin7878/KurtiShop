// components/RecentActivity.jsx
const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map((act, i) => (
          <li key={i} className="flex justify-between text-gray-700">
            <span>{act.message}</span>
            <span className="text-sm text-gray-400">{act.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
