// src/middlewares/auth.js
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/db.js";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato "Bearer TOKEN"

  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido o expirado" });
    
    // Guardamos los datos decodificados (idUsuario, rol, nombre) en la request
    req.user = user; 
    next(); 
  });
};