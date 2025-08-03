import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const TwoFactorSetup = () => {
  const { adminInfo, login } = useAuth();
  
  // This is our component's private, reliable source of truth for the UI.
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // This effect runs only when the global adminInfo changes, keeping our component in sync.
  useEffect(() => {
    if (adminInfo) {
      setIs2FAEnabled(adminInfo.twoFactorEnabled || false);
    }
  }, [adminInfo]);

  const handleGenerate = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/2fa/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminInfo.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to generate QR code.');
      setQrCodeUrl(data.qrCodeUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/2fa/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: adminInfo._id, token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        login(data); // This updates the global context
        setIs2FAEnabled(true); // This FORCES an immediate UI update
        setMessage("Success! 2FA is now enabled on your account.");
        setQrCodeUrl('');
    } catch (err) { setError(err.message); }
  };
  
  const handleDisable = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/2fa/disable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminInfo.token}` },
            body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        login(data); // This updates the global context
        setIs2FAEnabled(false); // This FORCES an immediate UI update
        setMessage("2FA has been successfully disabled.");
        setPassword('');
    } catch (err) { setError(err.message); }
  };

  // --- THE RENDER LOGIC NOW ONLY USES OUR RELIABLE INTERNAL STATE ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication (2FA)</h2>
      
      {message && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{message}</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      
      {is2FAEnabled ? (
        // UI FOR WHEN 2FA IS ENABLED
        <form onSubmit={handleDisable}>
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
                <p className="font-bold">2FA is Active on your account.</p>
            </div>
            <label className="block font-medium mb-1">Enter your password to disable 2FA.</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="p-2 border rounded w-full mt-2" />
            <button type="submit" className="mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">Disable 2FA</button>
        </form>
      ) : (
        // UI FOR WHEN 2FA IS DISABLED
        <div>
          {!qrCodeUrl ? (
            <>
              <p className="mb-4 text-gray-700">Secure your account by enabling 2FA.</p>
              <button onClick={handleGenerate} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">Enable 2FA</button>
            </>
          ) : (
            <div>
              <p className="font-semibold text-gray-800">1. Scan QR Code</p>
              <img src={qrCodeUrl} alt="QR Code" className="my-4 border p-2 bg-white" />
              <p className="font-semibold text-gray-800">2. Enter the 6-digit code from your app to verify and activate.</p>
              <form onSubmit={handleVerify} className="flex items-center gap-2 mt-2">
                <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="123456" className="p-2 border rounded w-40 text-center tracking-[0.2em]" maxLength="6" required />
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">Verify & Activate</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;