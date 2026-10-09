import { Router } from "express";
import { submissionListQuerySchema } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import { currentUser, requireAuth } from "../../middleware/auth";
import { listUserSubmissions } from "../submissions/submissions.service";
import { getProfile, getUserStats } from "./users.service";

/** Routes about the signed-in user, mounted at /me. */
export const meRouter = Router();
meRouter.use(requireAuth);

meRouter.get("/stats", async (req, res) => {
  res.json(await getUserStats(currentUser(req).id));
});

meRouter.get("/submissions", async (req, res) => {
  const query = parseInput(submissionListQuerySchema, req.query);
  res.json(await listUserSubmissions(currentUser(req).id, query));
});

/** Public profiles, mounted at /users. */
export const usersRouter = Router();

usersRouter.get("/:id/profile", async (req, res) => {
  res.json(await getProfile(String(req.params.id)));
});
