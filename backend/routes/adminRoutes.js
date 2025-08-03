const express = require('express');
const router = express.Router();
const {
  authAdmin,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  changePassword,
  disableTwoFactor,
  getUserProfile
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware'); // We need 'protect' for the generate route

// Step 1: Regular Login
router.post('/login', authAdmin);

// --- NEW 2FA ROUTES ---
// Step 2 (Optional Setup): Generate a QR code. This is a protected route.
router.post('/2fa/generate', protect, generateTwoFactorSecret);

// Step 3: Verify the 6-digit code from the app
router.post('/2fa/verify', verifyTwoFactorToken);

router.put('/change-password', protect, changePassword);

router.post('/2fa/disable', protect, disableTwoFactor);

router.get('/user/:id', protect, getUserProfile);


module.exports = router;