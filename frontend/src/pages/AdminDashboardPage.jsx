import { useAuth } from '../context/AuthContext.jsx';

const AdminDashboardPage = () => {
  const { adminInfo } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back, {adminInfo?.username}!</p>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p>
          Select an option from the sidebar to get started. Here you can manage your menu items, 
          create promotions, and update site settings.
        </p>
        {/* In the future, we can add sales statistics or live order summaries here. */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;