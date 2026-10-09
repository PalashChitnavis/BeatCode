import type { Request, Response } from "express";
import { createSubmissionSchema } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import * as submissions from "./submissions.service";

export async function create(req: Request, res: Response) {
  const input = parseInput(createSubmissionSchema, req.body);
  res.status(202).json(await submissions.createSubmission(input, req.user?.id));
}

export async function get(req: Request, res: Response) {
  res.json(await submissions.getSubmission(String(req.params.id), req.user?.id));
}
