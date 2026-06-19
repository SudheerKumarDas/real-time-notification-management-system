import express from "express";

import { login, register,profile } from "../controllers/authController.js";
import verifyJWT from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile",verifyJWT,profile)

export default router;