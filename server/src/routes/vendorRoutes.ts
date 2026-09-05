import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listVendors, getVendor, createVendor, updateVendor, deleteVendor } from '../controllers/vendorController.js';

const router = Router();

router.get('/', authenticateToken, listVendors);
router.get('/:id', authenticateToken, getVendor);
router.post('/', authenticateToken, requireOperator, createVendor);
router.put('/:id', authenticateToken, requireOperator, updateVendor);
router.delete('/:id', authenticateToken, requireOperator, deleteVendor);

export const vendorRouter = router;
