import { Router } from "express";
import { pageQuerySchema } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import { getLeaderboard } from "./leaderboard.service";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res) => {
  res.json(await getLeaderboard(parseInput(pageQuerySchema, req.query)));
});
