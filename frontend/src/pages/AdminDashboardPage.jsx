const AdminDashboardPage = () => {
  // In the future, we will use the useAuth() hook here to get admin info and logout function
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, Admin! This area is protected.</p>
      <p>Here you will be able to manage menu items, promotions, and more.</p>
    </div>
  );
};

export default AdminDashboardPage;