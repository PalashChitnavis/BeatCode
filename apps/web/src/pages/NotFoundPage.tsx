import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col-reverse items-center justify-center gap-10 px-6 text-center md:flex-row md:text-left">
      <div>
        <h1 className="text-4xl font-bold">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-muted-foreground">The link may be broken or the page may have moved.</p>
        <Button className="mt-6" asChild>
          <Link to="/">Back home</Link>
        </Button>
      </div>
      <img src="/Error.png" alt="" className="w-64 max-w-full" />
    </div>
  );
}
