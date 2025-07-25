const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: "Access denied" });
    next();
  };
};

module.exports = { protect, requireRole };
