import { Router } from 'express';
import { getUserPointsById,getUsuarios, createUsuario, login,getUsuarioById } from '../controllers/usuario.controller';

const router = Router();

// Ruta para obtener usuarios
router.get('/usuarios', getUsuarios);

//Ruta para obtener puntos de un usuario
router.get('/puntos/:id_usuario', getUserPointsById);

// Ruta para crear un nuevo usuario
router.post('/createUsuario', createUsuario);

// Ruta para iniciar sesión
router.post('/login', login);

router.get('/datos/:id_usuario',getUsuarioById);
export default router;
