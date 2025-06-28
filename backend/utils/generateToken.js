const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // 'sign' creates a new token.
  // It takes a payload (the user's ID), a secret key, and options (expires in 30 days).
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;