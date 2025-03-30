require("dotenv").config(); // Carga las variables de entorno
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware para permitir JSON en las peticiones
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando correctamente!");
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
