// src/routes/citasRoutes.js
import express from "express";
import { obtenerCitasPorCliente } from "../controllers/citasController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

// Aplicamos verificarToken para asegurar que solo usuarios logueados vean citas
router.get("/:id_cliente", verificarToken, obtenerCitasPorCliente);

export default router;