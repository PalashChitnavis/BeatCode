import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/features/auth/UserMenu";
import { resolveTheme, useSettings } from "@/features/settings/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/problems", label: "Problems" },
  { to: "/playground", label: "Playground" },
  { to: "/rooms", label: "Code Rooms" },
  { to: "/leaderboard", label: "Leaderboard" },
];

function ThemeToggle() {
  const theme = useSettings((s) => s.theme);
  const update = useSettings((s) => s.update);
  const dark = resolveTheme(theme) === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => update({ theme: dark ? "light" : "dark" })}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
    isActive ? "text-foreground" : "text-muted-foreground",
  );

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t px-4 py-3 md:hidden" aria-label="Mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
