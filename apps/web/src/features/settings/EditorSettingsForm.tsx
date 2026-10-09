import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "./store";

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-input"}`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export function EditorSettingsForm() {
  const settings = useSettings();
  return (
    <div className="grid gap-5">
      <Row label="Font size" hint="Size of code in the editor.">
        <Select
          value={String(settings.fontSize)}
          onValueChange={(v) => settings.update({ fontSize: Number(v) })}
        >
          <SelectTrigger className="w-28" aria-label="Font size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[12, 13, 14, 16, 18, 20, 22].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>
      <Row label="Tab size" hint="Spaces inserted per indent.">
        <Select
          value={String(settings.tabSize)}
          onValueChange={(v) => settings.update({ tabSize: v === "2" ? 2 : 4 })}
        >
          <SelectTrigger className="w-28" aria-label="Tab size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
          </SelectContent>
        </Select>
      </Row>
      <Row label="Word wrap" hint="Wrap long lines instead of scrolling.">
        <Toggle
          label="Word wrap"
          checked={settings.wordWrap}
          onChange={(wordWrap) => settings.update({ wordWrap })}
        />
      </Row>
      <Row label="Minimap" hint="Show a code overview on the right.">
        <Toggle
          label="Minimap"
          checked={settings.minimap}
          onChange={(minimap) => settings.update({ minimap })}
        />
      </Row>
    </div>
  );
}
