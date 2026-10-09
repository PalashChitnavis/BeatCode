import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, RequestHandler } from "express";
import type { ApiErrorBody } from "@beatcode/shared";
import { logger } from "../config/logger";
import { AppError, notFound } from "../lib/errors";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(notFound(`Route ${req.method} ${req.path} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    error = new AppError(409, "CONFLICT", "A record with these details already exists");
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    error = notFound();
  } else if (typeof err?.status === "number" && err.status >= 400 && err.status < 500) {
    // Errors raised by body-parser (malformed JSON, payload too large, ...).
    error = new AppError(
      err.status,
      err.type === "entity.too.large" ? "PAYLOAD_TOO_LARGE" : "BAD_REQUEST",
      err.message,
    );
  } else {
    (req.log ?? logger).error({ err }, "unhandled error");
    error = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }

  const body: ApiErrorBody = { error: { code: error.code, message: error.message, details: error.details } };
  res.status(error.status).json(body);
};
