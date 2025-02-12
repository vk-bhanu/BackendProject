const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorize Access" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "You do not have permission" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Internal Server error" });
    }
  };
};

export default roleMiddleware;
