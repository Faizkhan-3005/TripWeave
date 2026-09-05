import { Router } from 'express';
import { globalSearch } from '../controllers/searchController.js';

export const searchRouter = Router();

searchRouter.get('/', globalSearch);
