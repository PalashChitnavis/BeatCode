import { Router } from "express";
import { submissionLimiter } from "../../middleware/rateLimit";
import * as controller from "./submissions.controller";

export const submissionsRouter = Router();

submissionsRouter.post("/", submissionLimiter, controller.create);
submissionsRouter.get("/:id", controller.get);
