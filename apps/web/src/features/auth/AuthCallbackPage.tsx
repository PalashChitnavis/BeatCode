import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { LoadingState } from "@/components/states";
import { refreshSession } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

/** Landing page after Google sign-in: the API has set the refresh cookie, so exchange it for a session. */
export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = params.get("error");
    const returnTo = params.get("returnTo");
    const target = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
    if (error) {
      toast.error(error);
      navigate("/", { replace: true });
      return;
    }
    void refreshSession().then((token) => {
      if (token) {
        void queryClient.invalidateQueries();
        toast.success("Signed in");
      } else {
        toast.error("Sign-in failed, please try again");
      }
      navigate(target, { replace: true });
    });
  }, [params, navigate]);

  return <LoadingState className="min-h-[60vh]" />;
}
