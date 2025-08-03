import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const SidebarIcon = ({ children }) => <span className="mr-3 text-xl w-6 text-center">{children}</span>;
const HamburgerIcon = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );

const AdminLayout = () => {
  const { adminInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-orange-500 text-white";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-4 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-center py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Cork Grill</h2>
          <span className="text-lg font-light">Admin Panel</span>
        </div>
        <nav className="flex-grow mt-6">
          <ul className="space-y-2">
            <li><NavLink to="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}><SidebarIcon>🏠</SidebarIcon>Dashboard</NavLink></li>
            <li><NavLink to="/admin/menu" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}><SidebarIcon>📄</SidebarIcon>Menu</NavLink></li>
            <li><NavLink to="/admin/promotions" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}><SidebarIcon>🔥</SidebarIcon>Promotions</NavLink></li>
            <li><NavLink to="/admin/settings" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}><SidebarIcon>⚙️</SidebarIcon>Settings</NavLink></li>
          </ul>
        </nav>
        <div className="pt-4 border-t border-gray-700">
            <div className="text-center mb-4"><p className="text-sm text-gray-400">Logged in as</p><p className="font-semibold">{adminInfo?.username}</p></div>
            <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors">Logout</button>
        </div>
      </aside>
      
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"></div>}

      {/* Main Content Area */}
      {/* --- FIX #1: Added overflow-x-hidden to prevent the whole page from stretching --- */}
      <div className="flex-1 flex flex-col overflow-x-hidden"> 
        {/* --- FIX #2: Made the mobile header sticky --- */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center lg:hidden sticky top-0 z-10">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700">
                <HamburgerIcon />
            </button>
            <h1 className="text-xl font-semibold">Admin</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;