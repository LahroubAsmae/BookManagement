import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protéger les routes - vérifier le token JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obtenir le token de l'en-tête
      token = req.headers.authorization.split(" ")[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtenir l'utilisateur à partir du token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Non autorisé, aucun token" });
  }
};

// Middleware admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Non autorisé en tant qu'administrateur" });
  }
};
