import type { Request, Response } from "express";
import { problemListQuerySchema, problemSubmissionsQuerySchema } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import { currentUser } from "../../middleware/auth";
import * as problems from "./problems.service";

const slugParam = (req: Request) => String(req.params.slug);

export async function list(req: Request, res: Response) {
  const query = parseInput(problemListQuerySchema, req.query);
  res.json(await problems.listProblems(query, req.user?.id));
}

export async function get(req: Request, res: Response) {
  res.json(await problems.getProblem(slugParam(req), req.user?.id));
}

export async function solutions(req: Request, res: Response) {
  res.json(await problems.getSolutions(slugParam(req)));
}

export async function submissions(req: Request, res: Response) {
  const { scope } = parseInput(problemSubmissionsQuerySchema, req.query);
  res.json(await problems.listProblemSubmissions(slugParam(req), scope, currentUser(req).id));
}
