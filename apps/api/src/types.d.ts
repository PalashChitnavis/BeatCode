declare global {
  namespace Express {
    interface Request {
      /** Set by the auth middleware when a valid access token is present. */
      user?: { id: string; name: string };
    }
  }
}

export {};
