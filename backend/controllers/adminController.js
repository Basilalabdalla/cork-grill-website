const AdminUser = require('../models/adminUserModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin user & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
  const { username, password } = req.body;

  // 1. Find the admin user by their username
  const admin = await AdminUser.findOne({ username });

  // 2. Check if the user exists AND if the entered password matches the stored, hashed password
  if (admin && (await admin.matchPassword(password))) {
    // 3. If they match, send back the user's info and a secure token
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    // 4. If they don't match, send an "Unauthorized" error
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

module.exports = { authAdmin };