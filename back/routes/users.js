import { serviceRouteWrap } from "../modules/misc.js";
import services from "../services/index.js";
import express from 'express';
const router = express.Router();

router.get('/me', serviceRouteWrap(services.getMe));

export default router;
