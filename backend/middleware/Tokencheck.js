const jwt = require("jsonwebtoken");

const authMiddleware = (req, res) => {
  try {
    const token = req.cookies.token; // ✅ Token from cookie
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token expired or invalid" });
      }
      res.status(200).json({message:'token is not expired'})
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;