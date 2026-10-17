import { useEffect, useState } from "react";
import type { Awareness } from "y-protocols/awareness";

interface CursorUser {
  name: string;
  color: string;
}

/** Injects per-participant colours and name tags for the cursors drawn by y-monaco. */
export function RemoteCursorStyles({ awareness }: { awareness: Awareness }) {
  const [css, setCss] = useState("");

  useEffect(() => {
    const render = () => {
      const rules: string[] = [];
      awareness.getStates().forEach((state, clientId) => {
        const user = state.user as CursorUser | undefined;
        if (clientId === awareness.clientID || !user) return;
        const color = user.color.replace(/[^a-z0-9.() %#-]/gi, "");
        const name = user.name.replace(/[^\p{L}\p{N} ._-]/gu, "").slice(0, 30);
        rules.push(
          `.yRemoteSelection-${clientId}{background-color:color-mix(in oklch, ${color} 30%, transparent)}`,
          `.yRemoteSelectionHead-${clientId}{border-color:${color}}`,
          `.yRemoteSelectionHead-${clientId}::after{content:"${name}";position:absolute;top:-1.3em;left:-2px;padding:0 4px;border-radius:3px;font-size:11px;white-space:nowrap;color:white;background:${color};pointer-events:none}`,
        );
      });
      setCss(rules.join("\n"));
    };
    render();
    awareness.on("change", render);
    return () => awareness.off("change", render);
  }, [awareness]);

  return <style>{css}</style>;
}
