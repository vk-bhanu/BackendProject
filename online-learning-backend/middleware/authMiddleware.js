import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyInstructor = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user.role !== "instructor") return res.status(403).json({ message: "Access denied" });
    next();
  });
};
