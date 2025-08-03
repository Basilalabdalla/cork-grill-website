import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const TwoFactorAuthPage = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // We get the admin's user ID from the state passed by the login page
  const userId = location.state?.userId;

  if (!userId) {
    // If someone tries to access this page directly without a userId, send them back to login
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      
      // If verification is successful, the backend sends the final JWT.
      // We use our login function to save it and redirect to the dashboard.
      login(data);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Enter 2FA Code</h1>
        <p className="text-center text-gray-600 mb-4">Open your authenticator app and enter the 6-digit code.</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="token">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-center tracking-[0.5em]"
              required
              maxLength="6"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;