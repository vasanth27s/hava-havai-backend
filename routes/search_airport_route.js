import { Router } from 'express';
import { getByIataCode } from "../controllers/search_airport_controller.js"

const router = Router();

router.route('/:iata_code').get(getByIataCode);


export default router;