const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

require("./config/database"); // sólo para inicializar

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/opciones", require("./routes/opcionesRoutes"));
app.use("/api/resultados", require("./routes/resultadosRoutes"));
app.use("/api/partidas", require("./routes/partidasRoutes"));

// filepath: /home/luis-lr/Documentos/U4_BARRON/NanoDock_Back/index.js
/* istanbul ignore next */
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
  });
}

module.exports = app;
