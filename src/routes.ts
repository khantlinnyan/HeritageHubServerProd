import express from 'express';
import planRoute from './features/plan/plan.route';
const router = express.Router();

router.use('/plan', planRoute);
export default router;
