import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { useAuthDialog } from "@/features/auth/dialogStore";
import { useAuthStatus } from "@/features/auth/hooks";

/** Renders children only for signed-in users; otherwise prompts to sign in. */
export function RequireAuth({ children, reason }: { children: ReactNode; reason: string }) {
  const status = useAuthStatus();
  const show = useAuthDialog((s) => s.show);

  if (status === "loading") return <LoadingState className="min-h-80" />;
  if (status === "anonymous") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center">
        <Lock className="size-8 text-muted-foreground" />
        <p className="text-lg font-medium">{reason}</p>
        <div className="flex gap-2">
          <Button onClick={() => show({ mode: "login", reason })}>Sign in</Button>
          <Button variant="outline" onClick={() => show({ mode: "register", reason })}>
            Create account
          </Button>
        </div>
      </div>
    );
  }
  return children;
}
