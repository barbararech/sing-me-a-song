import { Router } from 'express';
import * as e2eController from '../controllers/e2eController.js';

const e2eRouter = Router();

e2eRouter.post('/e2e/reset', e2eController.reset);
e2eRouter.get('/e2e/recommendations/:name', e2eController.findByName);

export default e2eRouter;
