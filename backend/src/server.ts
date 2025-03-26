import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuario.routes';
import ingresoRoutes from './routes/ingreso.routes';
import egresoRoutes from './routes/egreso.routes';
import morgan from 'morgan';  // Importa morgan
import pool from './database'; // Importamos la conexión

dotenv.config();

const app = express();

app.use(morgan('dev')); 

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api', ingresoRoutes);
app.use('/api', egresoRoutes);

const PORT = process.env.PORT || 3000;

// Solo inicia el servidor si el archivo se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exporta la instancia de Express
export default app;
