// d:\Shmulik-gisApp-V1\gisApp\backend\middleware\authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Get token from the Authorization header (Bearer TOKEN)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token part

  if (token == null) {
    // If no token, return 401 Unauthorized
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If token is invalid or expired, return 403 Forbidden
      console.error("JWT Verification Error:", err.message); // Log the error
      if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ message: 'Token expired.' });
      }
      return res.status(403).json({ message: 'Invalid token.' });
    }

    // If token is valid, attach the decoded payload (user info) to the request object
    req.user = user; // The payload usually contains { userId, username, isAdmin, iat, exp }
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;
