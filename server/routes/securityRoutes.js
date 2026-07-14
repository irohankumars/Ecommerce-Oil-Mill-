// Security route registration.
import { Router } from "express";
import { body } from "express-validator";
import { reportSuspiciousActivity } from "../controllers/securityController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/activity", [body("signal").trim().isLength({ min: 2, max: 80 }).withMessage("Valid signal is required.")], validate, reportSuspiciousActivity);

export default router;

