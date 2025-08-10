import express from 'express';
import planRoute from './features/plan/plan.route';
import placeRoute from './features/place/place.route';
const router = express.Router();

router.use('/plan', planRoute);
router.use('/place', placeRoute);
export default router;
