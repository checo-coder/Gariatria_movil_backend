# ⚙️ OldFit API - Core Engine

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-lightgrey)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4.x-black)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Railway](https://img.shields.io/badge/Deployed_on-Railway-blueviolet)](https://railway.app/)

Este es el motor central de **OldFit**. Un servidor robusto construido en Node.js que gestiona la persistencia de datos, autenticación segura y la transmisión de ubicación en tiempo real para el cuidado de adultos mayores.

---

## 🛠️ Stack Tecnológico

* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Comunicación en Tiempo Real:** Socket.io (WebSockets)
* **Base de Datos:** PostgreSQL / Sequelize ORM
* **Autenticación:** JSON Web Tokens (JWT) & Bcrypt para encriptación de contraseñas.
* **Despliegue:** Railway.app

---

## 📡 Arquitectura de Tiempo Real (WebSockets)

El sistema de rastreo utiliza **Socket.io** para garantizar una latencia mínima. El flujo de datos se organiza mediante salas privadas para proteger la privacidad del paciente:

| Evento | Origen | Descripción |
| :--- | :--- | :--- |
| `unirse-rastreo` | Cuidador | El médico se une a la sala única del paciente (`id_paciente`). |
| `enviar-ubicacion` | Paciente | Emite las coordenadas `{lat, lng}` al servidor. |
| `ubicacion-actualizada` | Servidor | El servidor retransmite los datos exclusivamente a los cuidadores suscritos. |

---

## 🛣️ Endpoints Principales (REST API)

### Autenticación y Usuarios
* `POST /api/auth/registro`: Registro de nuevos usuarios (Pacientes/Médicos).
* `POST /api/auth/login`: Validación de credenciales y entrega de token JWT.

### Gestión de Salud y Ubicación
* `GET /api/paciente/:id`: Recupera información del perfil y zona segura.
* `POST /api/ubicacion/fondo`: Endpoint de respaldo para actualizaciones vía HTTPS cuando el socket está inactivo.
* `GET /api/reportes/:id`: Obtiene datos para las gráficas de rendimiento cognitivo.

---

## 🚀 Configuración e Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/checo-coder/Gariatria_movil.git](https://github.com/checo-coder/Gariatria_movil.git)
    cd backend (o el nombre de tu carpeta de servidor)
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz con los siguientes datos:
    ```env
    PORT=3000
    DATABASE_URL=tu_cadena_de_conexion_postgresql
    JWT_SECRET=tu_llave_secreta_personalizada
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

---

## ⚖️ Licencia y Atribución

Este proyecto es de código abierto. Eres libre de **clonar, adaptar y mejorar** este software. 

**Condición de uso:** Se requiere otorgar el reconocimiento correspondiente al creador original: **Sergio Altamira Mojarro**, manteniendo su nombre en los créditos del repositorio y de cualquier aplicación derivada.

> "La tecnología al servicio de la salud humana es la herramienta más poderosa que podemos construir."

---

## 👨‍💻 Desarrollador
**Sergio Altamira Mojarro** [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sergio-altamira-82ba52336/)
