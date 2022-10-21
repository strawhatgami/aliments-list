import { serviceRouteWrap } from "../modules/misc.js";
import services from "../services/index.js";
import express from 'express';
const router = express.Router();

router.use((req, res, next) => {
  console.log("here:", {url: req.url, method: req.method});
  next();
})
router.get('/', serviceRouteWrap(services.findAlimentsByName));
router.get('/:id', serviceRouteWrap(services.findAliment));
router.post('/', serviceRouteWrap(services.createAliment));
router.put('/:id', serviceRouteWrap(services.updateAliment));
router.delete('/:id', serviceRouteWrap(services.deleteAliment));

export default router;
