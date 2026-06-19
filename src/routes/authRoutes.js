import express from "express";

import { login, register,profile, followUser } from "../controllers/authController.js";
import verifyJWT from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile",verifyJWT,profile)
router.post("/users/:id/follow",verifyJWT,followUser);

export default router;