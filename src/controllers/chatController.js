import { pool } from "../config/db.js";

// 1. Obtener el médico asignado (Paciente o Cuidador)
export const obtenerMiGeriatra = async (req, res) => {
  const idUsuario = req.user.idUsuario; // Extraído del token por verificarToken
  const rol = req.user.rol;

  try {
    let query = "";
    let values = [idUsuario];

    // Si es cuidador, buscamos a través de la tabla asignación
    if (rol === "cuidador") {
      query = `
        SELECT DISTINCT g.id_geriatra, g.nombre 
        FROM asignacion a
        JOIN medicamentos m ON a.id_paciente = m.id_paciente
        JOIN geriatras g ON m.id_geriatra = g.id_geriatra
        WHERE a.id_cuidador = $1
        LIMIT 1;
      `;
    } else {
      // Si es el paciente mismo
      query = `
        SELECT DISTINCT g.id_geriatra, g.nombre 
        FROM medicamentos m
        JOIN geriatras g ON m.id_geriatra = g.id_geriatra
        WHERE m.id_paciente = $1
        LIMIT 1;
      `;
    }

    const resultado = await pool.query(query, values);

    if (resultado.rows.length > 0) {
      res.json(resultado.rows[0]);
    } else {
      res.status(404).json({ mensaje: "No tienes un médico asignado aún." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos del médico" });
  }
};

// 2. Obtener o crear el ID de la conversación
export const accederConversacion = async (req, res) => {
  const { id_geriatra } = req.params;
  const id_cliente = req.user.idUsuario;

  try {
    let chat = await pool.query(
      "SELECT id_conversacion FROM conversacion WHERE id_cliente = $1 AND id_geriatra = $2",
      [id_cliente, id_geriatra]
    );

    if (chat.rows.length === 0) {
      chat = await pool.query(
        "INSERT INTO conversacion (id_cliente, id_geriatra) VALUES ($1, $2) RETURNING id_conversacion",
        [id_cliente, id_geriatra]
      );
    }
    res.json(chat.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener chat" });
  }
};

// 3. Listar historial de mensajes
export const listarMensajes = async (req, res) => {
  const { id_conversacion } = req.params;
  try {
    const mensajes = await pool.query(
      "SELECT * FROM mensajes WHERE id_conversacion = $1 ORDER BY fecha_envio ASC",
      [id_conversacion]
    );
    res.json(mensajes.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar mensajes" });
  }
};

// 4. Guardar mensaje enviado (Lógica de base de datos)
export const guardarMensaje = async (req, res) => {
  const { id_conversacion, contenido_texto, tipo_remitente } = req.body;
  const id_remitente = req.user.idUsuario;

  try {
    const nuevoMensaje = await pool.query(
      `INSERT INTO mensajes (id_conversacion, id_remitente, tipo_remitente, contenido_texto) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *, fecha_envio as "fechaEnvio"`,
      [id_conversacion, id_remitente, tipo_remitente, contenido_texto]
    );
    res.status(201).json(nuevoMensaje.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el mensaje" });
  }
};