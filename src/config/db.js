import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geriatria",
  password: "sergio",
  port: 5432,
});

export const SECRET_KEY = "mi_clave_secreta_para_jwt";