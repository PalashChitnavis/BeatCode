import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="BeatCode home"
      className={cn(
        "flex h-9 items-center rounded-lg bg-brand px-1 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <img src="/logo.svg" alt="BeatCode" className="h-6 w-auto" />
    </Link>
  );
}
