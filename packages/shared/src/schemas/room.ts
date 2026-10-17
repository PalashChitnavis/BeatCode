import { z } from "zod";
import { ROOM_CODE_LENGTH } from "../limits";

export const roomCodeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(new RegExp(`^[a-z0-9]{${ROOM_CODE_LENGTH}}$`), "Invalid room code");
