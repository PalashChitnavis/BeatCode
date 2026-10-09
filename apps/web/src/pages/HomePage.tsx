import { ArrowRight, Code2, ListChecks, ShieldCheck, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const features: { icon: ReactNode; title: string; body: string; to: string }[] = [
  {
    icon: <ListChecks />,
    title: "Practice problems",
    body: "Solve curated problems in C, C++, Java or Python, judged against hidden tests with instant verdicts.",
    to: "/problems",
  },
  {
    icon: <Code2 />,
    title: "Online playground",
    body: "Write and run code with custom input in a full editor. No setup, nothing to install.",
    to: "/playground",
  },
  {
    icon: <Users />,
    title: "Code rooms",
    body: "Pair program in real time with live cursors and a built-in video call.",
    to: "/rooms",
  },
  {
    icon: <Trophy />,
    title: "Leaderboard",
    body: "Track what you have solved and see how you rank against everyone else.",
    to: "/leaderboard",
  },
];

export function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" /> Every run is isolated in its own sandbox
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            A better way to <span className="text-primary">level up</span> your coding.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Practice problems, an online compiler and collaborative code rooms with video, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/problems">
                Start practicing <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/playground">Open playground</Link>
            </Button>
          </div>
        </div>
        <img src="/Home-Page-Tree.svg" alt="" className="mx-auto hidden w-full max-w-md lg:block" />
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary [&_svg]:size-5">
                {feature.icon}
              </div>
              <h2 className="font-semibold group-hover:text-primary">{feature.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{feature.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
