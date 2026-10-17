import { Monitor, Moon, Sun } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EditorSettingsForm } from "./EditorSettingsForm";
import { useSettings, type Theme } from "./store";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "system", label: "System", icon: <Monitor /> },
];

export function SettingsPage() {
  const theme = useSettings((s) => s.theme);
  const update = useSettings((s) => s.update);

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title="Settings" description="Preferences are saved in this browser." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how BeatCode looks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update({ theme: t.value })}
                aria-pressed={theme === t.value}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors [&_svg]:size-5",
                  theme === t.value ? "border-primary bg-primary/5" : "hover:bg-muted",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Applies to the playground, problems and code rooms.</CardDescription>
          </CardHeader>
          <CardContent>
            <EditorSettingsForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
