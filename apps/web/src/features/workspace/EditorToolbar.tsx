import { RotateCcw, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@beatcode/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditorSettingsForm } from "@/features/settings/EditorSettingsForm";

export function EditorToolbar({
  language,
  onLanguageChange,
  onReset,
  children,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onReset: () => void;
  /** Extra actions such as Run / Submit, rendered on the right. */
  children?: ReactNode;
}) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b px-2">
      <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
        <SelectTrigger className="h-8 w-28 border-0 bg-muted/60" aria-label="Language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onReset}
        title="Reset to starter code"
        aria-label="Reset code"
      >
        <RotateCcw />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" title="Editor settings" aria-label="Editor settings">
            <Settings2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editor settings</DialogTitle>
          </DialogHeader>
          <EditorSettingsForm />
        </DialogContent>
      </Dialog>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
