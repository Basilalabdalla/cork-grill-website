const AdminUser = require('../models/adminUserModel');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  // We get the user from the 'protect' middleware
  const admin = await AdminUser.findById(req.user._id);

  if (admin && (await admin.matchPassword(oldPassword))) {
    // If the old password is correct, we can set the new one.
    // The 'pre-save' hook in the model will automatically hash it before saving.
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(401).json({ message: 'Invalid old password' });
  }
};

const authAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminUser.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      // If 2FA is enabled for this user, don't send the final JWT token yet.
      // Send a confirmation that the password was correct.
      if (admin.twoFactorSecret) {
        res.json({
          _id: admin._id,
          username: admin.username,
          twoFactorRequired: true, // Use a clear flag name
        });
      } else {
        // If 2FA is not enabled, log them in directly as before.
        res.json({
          _id: admin._id,
          username: admin.username,
          token: generateToken(admin._id),
        });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Generate a 2FA secret and QR code for an admin to scan
// @route   POST /api/admin/2fa/generate
// @access  Private/Admin (requires a valid JWT)
const generateTwoFactorSecret = async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    // --- THIS IS THE CORRECTED SECRET GENERATION ---
    const secret = speakeasy.generateSecret({
      name: `CorkGrillAdmin (${admin.username})`,
    });

    // CRITICAL FIX: We were saving secret.base32, but the QR code URL uses secret.ascii.
    // We MUST save the SAME secret that the QR code uses.
    admin.twoFactorSecret = secret.ascii; // Save the ASCII secret
    admin.twoFactorAuthUrl = secret.otpauth_url;
    await admin.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) throw new Error('Could not generate QR code');
      res.json({ qrCodeUrl: data_url });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Verify a 2FA token and complete the login process
// @route   POST /api/admin/2fa/verify
// @access  Public
const verifyTwoFactorToken = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const admin = await AdminUser.findById(userId);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });
/*
    console.log('--- 2FA VERIFICATION DEBUG ---');
    console.log(`Verifying token: ${token}`);
    console.log(`Secret from DB: ${admin.twoFactorSecret}`);
    console.log(`Encoding method to be used: ascii`);
    
    // This generates the token the server EXPECTS right now
    const serverToken = speakeasy.totp({
      secret: admin.twoFactorSecret,
      encoding: 'ascii',
    });
    console.log(`Server EXPECTS token: ${serverToken}`);
*/
    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      // --- CRITICAL FIX: Tell speakeasy to use the same encoding ---
      encoding: 'ascii', 
      token: token,
      window: 2 
    });

    if (verified) {
      if (!admin.twoFactorEnabled) {
        admin.twoFactorEnabled = true;
        await admin.save();
      }
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const disableTwoFactor = async (req, res) => {
  const { password } = req.body;
  
  // We get the user from the 'protect' middleware
  const admin = await AdminUser.findById(req.user._id);

  // First, verify the admin's current password to authorize this action
  if (admin && (await admin.matchPassword(password))) {
    // If password is correct, disable 2FA
    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = undefined; // Remove the secret key
    admin.twoFactorAuthUrl = undefined; // Remove the URL
    
    const updatedAdmin = await admin.save();

    // Send back a new JWT token that reflects the updated user state
    res.json({
        _id: updatedAdmin._id,
        username: updatedAdmin.username,
        token: generateToken(updatedAdmin._id),
        twoFactorEnabled: updatedAdmin.twoFactorEnabled,
    });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
};

const getUserProfile = async (req, res) => {
  const admin = await AdminUser.findById(req.params.id).select('-password');
  if (admin) {
    res.json(admin);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  authAdmin,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  changePassword,
  disableTwoFactor,
  getUserProfile,
};