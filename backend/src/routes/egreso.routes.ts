import { Router } from 'express';
import { 
  getEgresos, 
  createEgreso, 
  getEgresoById, 
  getEgresosByUserID, 
  updateEgreso, 
  deleteEgreso 
} from '../controllers/egreso.controller';

const router = Router();

// Rutas para Egresos
router.get('/', getEgresos);
router.post('/', createEgreso);
router.get('/:id', getEgresoById);
router.get('/usuario/:id_usuario', getEgresosByUserID);
router.put('/:id', updateEgreso);
router.delete('/:id', deleteEgreso);

export default router;