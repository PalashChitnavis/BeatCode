import { Router } from "express";
import { roomCodeSchema } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import { currentUser, requireAuth } from "../../middleware/auth";
import { roomLimiter } from "../../middleware/rateLimit";
import { createRoom, getActiveRoom } from "./rooms.service";

export const roomsRouter = Router();
roomsRouter.use(requireAuth);

roomsRouter.post("/", roomLimiter, async (req, res) => {
  res.status(201).json(await createRoom(currentUser(req).id));
});

roomsRouter.get("/:code", async (req, res) => {
  res.json(await getActiveRoom(parseInput(roomCodeSchema, req.params.code)));
});
