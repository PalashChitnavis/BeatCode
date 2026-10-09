import { createBrowserRouter } from "react-router";
import { AppShell, RouteError } from "./AppShell";
import { RootLayout, type RouteHandle } from "./layouts/RootLayout";

const fullscreen: RouteHandle = { fullscreen: true };

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        element: <RootLayout />,
        errorElement: <RouteError />,
        children: [
          { index: true, lazy: () => import("@/pages/HomePage").then((m) => ({ Component: m.HomePage })) },
          {
            path: "problems",
            lazy: () =>
              import("@/features/problems/ProblemsPage").then((m) => ({ Component: m.ProblemsPage })),
          },
          {
            path: "problems/:slug",
            handle: fullscreen,
            lazy: () => import("@/features/problems/ProblemPage").then((m) => ({ Component: m.ProblemPage })),
          },
          {
            path: "playground",
            handle: fullscreen,
            lazy: () =>
              import("@/features/playground/PlaygroundPage").then((m) => ({ Component: m.PlaygroundPage })),
          },
          {
            path: "rooms",
            lazy: () => import("@/features/rooms/RoomsPage").then((m) => ({ Component: m.RoomsPage })),
          },
          {
            path: "rooms/:code",
            handle: fullscreen,
            lazy: () => import("@/features/rooms/RoomPage").then((m) => ({ Component: m.RoomPage })),
          },
          {
            path: "leaderboard",
            lazy: () =>
              import("@/features/leaderboard/LeaderboardPage").then((m) => ({
                Component: m.LeaderboardPage,
              })),
          },
          {
            path: "submissions",
            lazy: () =>
              import("@/features/submissions/SubmissionsPage").then((m) => ({
                Component: m.SubmissionsPage,
              })),
          },
          {
            path: "u/:userId",
            lazy: () => import("@/features/profile/ProfilePage").then((m) => ({ Component: m.ProfilePage })),
          },
          {
            path: "settings",
            lazy: () =>
              import("@/features/settings/SettingsPage").then((m) => ({ Component: m.SettingsPage })),
          },
          {
            path: "auth/callback",
            lazy: () =>
              import("@/features/auth/AuthCallbackPage").then((m) => ({ Component: m.AuthCallbackPage })),
          },
          {
            path: "*",
            lazy: () => import("@/pages/NotFoundPage").then((m) => ({ Component: m.NotFoundPage })),
          },
        ],
      },
    ],
  },
]);
