import { lazy, Suspense } from "react";
import { isRouteErrorResponse, Link, Outlet, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthDialog } from "@/features/auth/dialogStore";

// The auth dialog (forms + validation) is only downloaded the first time it opens.
const AuthDialog = lazy(() => import("@/features/auth/AuthDialog").then((m) => ({ default: m.AuthDialog })));

export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{notFound ? "Page not found" : "Something went wrong"}</h1>
      <p className="text-muted-foreground">
        {notFound ? "The page you are looking for does not exist." : "Please reload the page and try again."}
      </p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}

export function AppShell() {
  const authDialogOpen = useAuthDialog((s) => s.open);
  return (
    <>
      <Outlet />
      {authDialogOpen && (
        <Suspense>
          <AuthDialog />
        </Suspense>
      )}
    </>
  );
}
