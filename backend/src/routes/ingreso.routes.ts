import { Router } from 'express';
import { 
  getIngresos, 
  createIngreso, 
  getIngresoById, 
  getIngresosByUserID, 
  updateIngreso, 
  deleteIngreso 
} from '../controllers/ingreso.controller';

const router = Router();

router.get('/', getIngresos);
router.post('/', createIngreso);
router.get('/:id', getIngresoById);
router.get('/ingresos/:id_usuario', getIngresosByUserID);
router.put('/:id', updateIngreso);
router.delete('/:id', deleteIngreso);

export default router;
