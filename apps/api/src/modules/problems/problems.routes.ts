import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as controller from "./problems.controller";

export const problemsRouter = Router();

problemsRouter.get("/", controller.list);
problemsRouter.get("/:slug", controller.get);
problemsRouter.get("/:slug/solutions", requireAuth, controller.solutions);
problemsRouter.get("/:slug/submissions", requireAuth, controller.submissions);
