import express from "express";
import { 
  obtenerUltimoReporte,
  obtenerHistorialReportes
} from "../controllers/reportesController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/ultimo/:id_cliente/", verificarToken, obtenerUltimoReporte);
router.get("/historial/:id_cliente/", verificarToken, obtenerHistorialReportes);

export default router;
