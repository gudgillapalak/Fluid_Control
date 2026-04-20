const authMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, "SECRET_KEY");

    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.user = decoded;
    next();
  };
};