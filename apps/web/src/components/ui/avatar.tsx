import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { colorFor } from "@/lib/format";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

export function UserAvatar({
  name,
  src,
  seed,
  className,
}: {
  name: string;
  src?: string | null;
  seed?: string;
  className?: string;
}) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center text-xs font-semibold text-white"
        style={{ background: colorFor(seed ?? name) }}
      >
        {initials(name) || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
