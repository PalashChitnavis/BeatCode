import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { authLimiter } from "../../middleware/rateLimit";
import * as controller from "./auth.controller";

export const authRouter = Router();

authRouter.get("/providers", controller.providers);
authRouter.post("/register", authLimiter, controller.register);
authRouter.post("/login", authLimiter, controller.login);
authRouter.post("/refresh", controller.refresh);
authRouter.post("/logout", controller.logout);
authRouter.get("/me", requireAuth, controller.me);
authRouter.get("/google", authLimiter, controller.googleStart);
authRouter.get("/google/callback", controller.googleCallback);
