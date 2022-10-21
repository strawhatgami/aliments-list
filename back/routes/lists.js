import { serviceRouteWrap } from "../modules/misc.js";
import services from "../services/index.js";
import express from 'express';
const router = express.Router();

// not implemented
//router.get('/', serviceRouteWrap(services.findlistsByName));
//router.put('/:id', serviceRouteWrap(services.updateList));
//router.delete('/:id', serviceRouteWrap(services.deleteList));
//router.delete('/:listid/aliments/:alimentid', serviceRouteWrap(services.removeAlimentFromList));

router.get('/:id', serviceRouteWrap(services.findList));
router.post('/:id', serviceRouteWrap(services.createList));
router.post('/:listid/aliments/:alimentid', serviceRouteWrap(services.addAlimentToList));

export default router;
