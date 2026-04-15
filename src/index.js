// ==========================================
// src/index.js - El Corazón del Servidor
// ==========================================

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { pool } from "./config/db.js"; // Importamos la conexión central

// 1. IMPORTACIÓN DE RUTAS MODULARES
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import medsRoutes from "./routes/medsRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import gpsRoutes from "./routes/gpsRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";

const app = express();
const server = http.createServer(app);

// Configuración de Socket.io para tiempo real
const io = new Server(server, { 
  cors: { origin: "*" } 
});

// 2. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json()); // Para que el servidor entienda JSON

// 3. REGISTRO DE RUTAS (Endpoints HTTP)
// Cada módulo tiene su propio prefijo para mantener el orden
app.use("/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/meds", medsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/gps", gpsRoutes);
app.use("/api/citas", citasRoutes);

// --- 4. RUTAS DE UTILIDAD (Interacción con Hardware/Notificaciones) ---

/**
 * Guarda el token de notificaciones de Expo para cada dispositivo
 */
app.post("/api/guardar-token", async (req, res) => {
  const { id_cliente, token } = req.body;
  try {
    await pool.query(
      "UPDATE clientes SET push_token = $1 WHERE id_cliente = $2",
      [token, id_cliente]
    );
    res.status(200).json({ mensaje: "Token de notificación actualizado correctamente" });
  } catch (error) {
    console.error("Error al guardar token:", error);
    res.status(500).json({ error: "No se pudo vincular el token de notificaciones" });
  }
});

/**
 * Recibe ubicación GPS del móvil cuando la app está en segundo plano
 * y la retransmite al cuidador de forma instantánea vía Sockets.
 */
app.post("/ubicacion-fondo", (req, res) => {
  const { id_paciente, latitud, longitud } = req.body;
  
  if (!id_paciente || !latitud || !longitud) {
    return res.status(400).json({ error: "Datos de GPS incompletos" });
  }

  // Magia: Convertimos la petición HTTP en un evento de Socket.io
  const datosUbicacion = { id_paciente, latitud, longitud };
  io.to(`sala-${id_paciente}`).emit("ubicacion-actualizada", datosUbicacion);
  
  console.log(`📍 [BG-GPS] Paciente ${id_paciente}: ${latitud}, ${longitud}`);
  res.status(200).json({ mensaje: "Ubicación retransmitida con éxito" });
});

// --- 5. LÓGICA DE SOCKETS (Comunicación Bidireccional) ---

io.on("connection", (socket) => {
  console.log("🟢 Nuevo dispositivo conectado:", socket.id);

  // --- MÓDULO: RASTREO GPS ---
  // El cuidador se une a la sala del paciente para monitorearlo
  socket.on("unirse-rastreo", (idPaciente) => {
    socket.join(`sala-${idPaciente}`);
    console.log(`📡 Cuidador unido a la sala de seguridad: ${idPaciente}`);
  });

  // Retransmisión de ubicación en primer plano
  socket.on("enviar-ubicacion", (datos) => {
    io.to(`sala-${datos.id_paciente}`).emit("ubicacion-actualizada", datos);
  });

  // --- MÓDULO: CHAT ---
  // Unirse a una conversación específica
  socket.on("unirse-chat", (idConversacion) => {
    socket.join(`chat-${idConversacion}`);
    console.log(`💬 Usuario entró al chat #${idConversacion}`);
  });

  // Envío de mensajes en tiempo real
  socket.on("enviar-mensaje", (data) => {
    // Retransmitimos a todos los integrantes de la sala de chat
    io.to(`chat-${data.id_conversacion}`).emit("recibir-mensaje", {
      ...data,
      fecha_envio: new Date(),
    });
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("🔴 Dispositivo desconectado");
  });
});

// --- 6. ARRANQUE DEL SERVIDOR ---
const PORT = 4000;
server.listen(PORT, () => {
  console.log("=================================================");
  console.log(`🚀 SERVIDOR MODULARIZADO CORRIENDO`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📅 Sistema: Geriatría App v2.0`);
  console.log("=================================================");
});