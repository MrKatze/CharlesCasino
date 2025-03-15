import { Router } from 'express';
import { getUsuarios, createUsuario, login } from '../controllers/usuario.controller';

const router = Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.post('/login', login);


export default router;
