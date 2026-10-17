import { History, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthDialog } from "./dialogStore";
import { useAuthStatus, useCurrentUser, useLogout } from "./hooks";

export function UserMenu() {
  const status = useAuthStatus();
  const user = useCurrentUser();
  const logout = useLogout();
  const showAuth = useAuthDialog((s) => s.show);

  if (status === "loading") return <Skeleton className="size-8 rounded-full" />;
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => showAuth({ mode: "login" })}>
          Sign in
        </Button>
        <Button size="sm" onClick={() => showAuth({ mode: "register" })}>
          Sign up
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full" aria-label="Account menu">
        <UserAvatar name={user.name} src={user.avatarUrl} seed={user.id} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/u/${user.id}`}>
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/submissions">
            <History /> Submissions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout.mutate()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
