import { Outlet, useMatches } from "react-router";
import { Header } from "./Header";

export interface RouteHandle {
  /** Workspace pages fill the viewport and hide the footer. */
  fullscreen?: boolean;
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          Built by{" "}
          <a
            className="hover:text-foreground"
            href="https://github.com/PalashChitnavis"
            target="_blank"
            rel="noreferrer"
          >
            Palash Chitnavis
          </a>{" "}
          &amp;{" "}
          <a
            className="hover:text-foreground"
            href="https://github.com/maheshcodes12"
            target="_blank"
            rel="noreferrer"
          >
            Mahesh Suryawanshi
          </a>
        </p>
        <a
          className="hover:text-foreground"
          href="https://github.com/PalashChitnavis/BeatCode"
          target="_blank"
          rel="noreferrer"
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}

export function RootLayout() {
  const matches = useMatches();
  const fullscreen = matches.some((m) => (m.handle as RouteHandle | undefined)?.fullscreen);

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      {fullscreen ? (
        <main className="h-[calc(100dvh-3.5rem)] min-h-0">
          <Outlet />
        </main>
      ) : (
        <>
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
