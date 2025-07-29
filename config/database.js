const mysql = require("mysql2");
require("dotenv").config();

let connection;

if (process.env.NODE_ENV !== "test") {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ Error al conectar a la base de datos:", err.message);
      return;
    }
    console.log("✅ Conexión a la base de datos MySQL establecida");
  });
} else {
  // Mock para testing
  connection = {
    execute: jest.fn().mockResolvedValue([[], []]), // respuesta vacía por defecto
  };
}

module.exports = connection;
