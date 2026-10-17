# BeatCode

Practice coding problems, run code online, and pair program in real time with a built-in video call.

![Home](docs/images/home.png)

- **Practice problems.** Solve problems in C, C++, Java or Python. **Run** checks your code against the sample tests, and **Submit** judges it against hidden tests and returns a verdict (Accepted, Wrong Answer, Time Limit Exceeded, and so on).
- **Playground.** A full editor (Monaco, the editor used in VS Code) with custom input.
- **Code rooms.** A shared editor where two people can type at the same time and see each other's cursors, with shared input and output and a peer-to-peer video call.
- **AI tutor.** An "AI Help" tab on every problem that sees the statement, your code and your last result, and gives hints, approaches, debugging help or complexity analysis without handing over the full solution.
- **Progress and leaderboard.** Tracks solved problems, has public profiles, and ranks users by problems solved, with harder problems breaking ties.

## Authors

- [Palash Chitnavis](https://github.com/PalashChitnavis)
- [Mahesh Suryawanshi](https://github.com/maheshcodes12)

## Architecture

```
          ┌──────────────────────────────┐
          │   apps/web  (React + Vite)   │
          └──────┬───────────────┬───────┘
            REST /api/v1     Socket.IO
                 │               │
          ┌──────▼───────────────▼───────┐       ┌────────────┐
          │      apps/api  (Express)     │──────►│ PostgreSQL │
          │ auth · problems · rooms · …  │       └────────────┘
          └──────┬────────────────▲──────┘
           judge │ jobs           │ results
          ┌──────▼────────────────┴──────┐
          │        Redis (BullMQ)        │
          └──────┬────────────────▲──────┘
          ┌──────▼────────────────┴──────┐
          │  apps/runner  (worker)       │──► one throwaway Docker container per run
          └──────────────────────────────┘
```

- **web** contains only the user interface. It never holds secrets, and the access token is kept in memory only.
- **api** handles authentication, validation, persistence, ranking and real-time features. It never executes user code.
- **runner** is the only component with Docker access, and it has no database access. The API puts everything a run needs into the job, and the runner sends verdicts back through a second, durable queue.
- **packages/shared** holds the zod schemas, enums and API types used by both sides, so the client and server always validate requests the same way.

### How a submission is judged

1. `POST /api/v1/submissions` validates the request and stores a `PENDING` submission. It then adds a job containing the user's code plus the problem's per-language **driver**, and the test cases. The response is `202` with the submission id.
2. The runner starts a sandbox container, compiles once, runs each test with its stdin, and compares the output. Trailing whitespace is ignored. **Submit** stops at the first failing test, while **Run** reports every sample.
3. The verdict is published to the results queue. The API stores it, updates the user's progress, and pushes the result to the browser over Socket.IO. The browser also polls as a fallback.

### Sandbox limits

Each run gets its own container with:

- no network access
- a read-only root filesystem, with a 64 MB tmpfs work directory
- a non-root user, all Linux capabilities dropped, and `no-new-privileges`
- memory, CPU and process-count limits
- a per-test time limit (Java gets ×2 and Python ×3)
- output capped at 64 KB

Containers are force-removed after each run and remove themselves after 5 minutes even if the runner crashes.

### Authentication

- **Access token:** a short-lived JWT (15 minutes) sent as a Bearer token and kept in memory only.
- **Refresh token:** an opaque, httpOnly cookie that is rotated on every use. Only its hash is stored. If an already-rotated token is presented again, every session for that user is revoked.
- **Google sign-in:** runs on the server using the authorization-code flow with state and PKCE. No client secret ever reaches the browser.

## Tech stack

|         |                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------- |
| Web     | React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI, TanStack Query, Zustand, React Router, Monaco, Yjs |
| API     | Node 22, Express 5, TypeScript, Prisma, PostgreSQL, Socket.IO, BullMQ, zod, jose, pino                    |
| Runner  | Node 22, BullMQ, Docker                                                                                   |
| Tooling | npm workspaces, ESLint, Prettier, Vitest, Supertest, GitHub Actions, Docker Compose                       |

## Repository layout

```
apps/
  api/          Express API, Prisma schema, migrations, problem catalog and seed
  runner/       judge worker and sandbox images (images/cpp, java, python)
  web/          React app
packages/
  shared/       schemas, enums, DTOs, judge and socket contracts
docker-compose.yml
```

## Getting started

Prerequisites: **Node 22** and **Docker**.

```bash
npm install
cp apps/api/.env.example apps/api/.env       # then set the two secrets, e.g. `openssl rand -base64 48`
cp apps/runner/.env.example apps/runner/.env
cp apps/web/.env.example apps/web/.env

docker compose up -d          # PostgreSQL and Redis (set POSTGRES_PORT=5433 if 5432 is taken, and update DATABASE_URL)
npm run images:build          # builds the C/C++, Java and Python sandbox images
npm run db:migrate            # creates the schema
npm run db:seed               # loads the problem catalog

npm run dev                   # api on :4000, runner, web on http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to the API, so you don't need to configure CORS or cookies for local development.

### Google sign-in (optional)

Create an OAuth client in Google Cloud Console and add `${API_ORIGIN}/api/v1/auth/google/callback` as an authorized redirect URI. Then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `apps/api/.env`. The Google button only appears when both are set.

### AI tutor (optional, free)

The tutor never costs money by default:

1. Create a key at [Google AI Studio](https://aistudio.google.com/apikey) in a Google Cloud project **with no billing account linked**. Such a project stays on the Gemini free tier and is never charged. Over the free quota, Google returns `429` and the tutor shows a "try again later" message.
2. Set `GEMINI_API_KEY` in `apps/api/.env`. `GEMINI_MODEL` picks any model the free tier offers (check the [pricing page](https://ai.google.dev/gemini-api/docs/pricing)).
3. The API also enforces its own caps: `AI_DAILY_LIMIT_PER_USER`, `AI_DAILY_LIMIT_GLOBAL` (keep it below the free tier's requests per day), a 6 per minute rate limit and `AI_MAX_OUTPUT_TOKENS`.

If the key can list models but every request fails with `403 PERMISSION_DENIED: Your project has been denied access`, Google has restricted the project (AI Studio shows it as "Restricted"). This is on Google's side; ask for a review from AI Studio or use Ollama. Do not link billing to lift it, since that makes the project chargeable.

To run without any external service, install [Ollama](https://ollama.com), run `ollama pull qwen2.5-coder:7b`, and set `AI_PROVIDER=ollama`. `AI_PROVIDER=none` turns the tutor off.

The model only sees what the student can already see: the statement, sample tests, their own code, and their own last result. Reference solutions and hidden tests are never sent. Free-tier Gemini prompts may be used by Google to improve its products, and the UI warns users not to paste secrets.

## Testing

```bash
npm test                              # unit + API integration tests (needs Postgres and Redis)
RUN_SANDBOX_TESTS=1 npm test          # also runs real sandboxes (needs Docker and the images)
npm run lint && npm run typecheck && npm run format:check
```

The API tests use a separate database (`TEST_DATABASE_URL`, which defaults to `postgresql://beatcode:beatcode@localhost:5432/beatcode_test`). It is created and migrated automatically before the tests run.

## Deployment

The simplest option is to run everything on one Docker host:

```bash
npm run images:build                        # the sandbox images must exist on the host
docker compose --profile app up -d --build  # app on http://localhost:8080
docker compose exec api node dist/seed.js   # load problems (safe to re-run)
```

In this setup the `web` container serves the app with nginx and proxies `/api` and `/socket.io` to the API, so everything is same-origin. The API applies pending migrations on start. Set `PUBLIC_URL` to your public origin and put a TLS-terminating proxy in front.

If the web app and the API are on **different domains** (for example, the web app on Netlify):

- Build the web app with `VITE_API_URL=https://api.example.com`.
- Set `WEB_ORIGIN` to the web origin.
- Set `COOKIE_SAMESITE=none`, which requires HTTPS.

**Runner isolation.** The runner talks to the Docker engine through its socket, which is root-equivalent on that host. In production, run the runner and its sandboxes on a dedicated VM. It only needs to reach Redis. For video calls between users behind strict NATs, configure a TURN server with `VITE_ICE_SERVERS`.

## Adding a problem

Problems are defined in `apps/api/prisma/problems/catalog.ts`. Each one has:

- a function signature, from which starter code and the stdin driver are generated for every language
- a TypeScript reference implementation, which computes all expected outputs
- tests, where `sample: true` marks the public examples
- a reference solution per language

Run `npm run db:seed` afterwards. Seeding is idempotent.

## Screenshots

| Problem workspace                     | Code room with video                        |
| ------------------------------------- | ------------------------------------------- |
| ![Problem](docs/images/problem.png)   | ![Room](docs/images/room.png)               |
| **Problems**                          | **Playground**                              |
| ![Problems](docs/images/problems.png) | ![Playground](docs/images/playground.png)   |
| **AI tutor**                          | **Leaderboard**                             |
| ![AI tutor](docs/images/ai-tutor.png) | ![Leaderboard](docs/images/leaderboard.png) |
