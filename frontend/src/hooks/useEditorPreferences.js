import { useState, useCallback } from "react"

const DEFAULTS = {
  theme:   "monokai",
  fontSize: "18px",
  tabSize:  "2",
}

const get = (key) => localStorage.getItem(`editor_${key}`) ?? DEFAULTS[key]
const set = (key, value) => localStorage.setItem(`editor_${key}`, value)

export const useEditorPreferences = () => {
  const [theme,    setThemeState]    = useState(() => get("theme"))
  const [fontSize, setFontSizeState] = useState(() => get("fontSize"))
  const [tabSize,  setTabSizeState]  = useState(() => get("tabSize"))

  const setTheme = useCallback((v) => { set("theme", v);    setThemeState(v)    }, [])
  const setFontSize = useCallback((v) => { set("fontSize", v); setFontSizeState(v) }, [])
  const setTabSize  = useCallback((v) => { set("tabSize", v);  setTabSizeState(v)  }, [])

  return { theme, fontSize, tabSize, setTheme, setFontSize, setTabSize }
}