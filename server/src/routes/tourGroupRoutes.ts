import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listTourGroups, createTourGroup, addGroupMember, removeGroupMember, updateTourGroup, deleteTourGroup } from '../controllers/tourGroupController.js';

const router = Router();

router.get('/', authenticateToken, listTourGroups);
router.post('/', authenticateToken, requireOperator, createTourGroup);
router.put('/:id', authenticateToken, requireOperator, updateTourGroup);
router.delete('/:id', authenticateToken, requireOperator, deleteTourGroup);
router.post('/:groupId/members', authenticateToken, requireOperator, addGroupMember);
router.delete('/:groupId/members/:memberId', authenticateToken, requireOperator, removeGroupMember);

export const tourGroupRouter = router;
