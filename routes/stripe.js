import express from "express";

import { singleCharge, saveCardAndCharge } from "../controllers/stripe.js";
import { addUserToRequest } from "../controllers/auth.js";

const router = express.Router();

router.use(addUserToRequest);

router.route("/singlecharge").post(singleCharge);
router.route("/savecardandcharge").post(saveCardAndCharge);

export default router;
