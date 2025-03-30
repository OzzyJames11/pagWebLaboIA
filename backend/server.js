const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
const pool = new Pool({
    user: 'postgres', // Usuario de PostgreSQL
    host: 'localhost',
    database: 'pasantias_lab', // Nombre de la base de datos
    password: process.env.PG_PASSWORD, // La contraseña que tienes en el archivo .env
    port: 5432,
});

// Ruta para obtener los pasantes
app.get('/api/pasantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pasantes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los pasantes');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
