import { Router } from 'express';
import { createTables, addData } from "../controllers/setup_controller.js";

const router = Router();

router.route('/create-tables').get(createTables);
router.route('/add-data').get(addData);

export default router;
