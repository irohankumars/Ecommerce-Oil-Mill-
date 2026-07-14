// Security route registration.
import { Router } from "express";
import { body } from "express-validator";
import { reportSuspiciousActivity } from "../controllers/securityController.js";
import { optionalProtect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/activity", optionalProtect, [body("signal").trim().isLength({ min: 2, max: 80 }).withMessage("Valid signal is required."), body("deviceId").optional().trim().isLength({ min: 8, max: 120 }).withMessage("Valid device id is required.")], validate, reportSuspiciousActivity);

export default router;



