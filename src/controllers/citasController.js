// src/controllers/citasController.js
import { pool } from "../config/db.js";

export const obtenerCitasPorCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const query = `
      SELECT 
        c.id_cita, 
        c.razon, 
        c.fecha, 
        g.nombre AS nombre_geriatra 
      FROM citas c
      JOIN geriatras g ON c.id_geriatra = g.id_geriatra
      WHERE c.id_cliente = $1 
      AND c.fecha >= NOW()
      ORDER BY c.fecha ASC;
    `;

    const result = await pool.query(query, [id_cliente]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ error: "Error al consultar las citas" });
  }
};