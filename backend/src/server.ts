import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuario.routes';
import ingresoRoutes from './routes/ingreso.routes';
import egresoRoutes from './routes/egreso.routes';
import pool from './database'; // Importamos la conexión

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/egresos', egresoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});

