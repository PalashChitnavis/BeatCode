import { useState } from "react"
import { useEditorPreferences } from "@/hooks/useEditorPreferences"

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "22px", "24px"]
const TAB_SIZES  = ["2", "4"]
const THEMES = [
  { value: "monokai",        label: "Monokai"        },
  { value: "github",         label: "GitHub"         },
  { value: "tomorrow",       label: "Tomorrow"       },
  { value: "twilight",       label: "Twilight"       },
  { value: "xcode",          label: "Xcode"          },
  { value: "solarized_dark", label: "Solarized Dark" },
  { value: "terminal",       label: "Terminal"       },
]

const SelectRow = ({ label, description, name, value, options, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
    <div>
      <p className="text-white text-sm font-medium">{label}</p>
      <p className="text-gray-400 text-xs">{description}</p>
    </div>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="bg-gray-700 text-white text-sm border border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer w-36"
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  </div>
)

const EditorSettings = () => {
  const [open, setOpen] = useState(false)
  const { theme, fontSize, tabSize, setTheme, setFontSize, setTabSize } = useEditorPreferences()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "theme")    setTheme(value)
    if (name === "fontSize") setFontSize(value)
    if (name === "tabSize")  setTabSize(value)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-300 hover:text-white transition"
        title="Editor settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gray-900 border border-gray-700 rounded-xl z-50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Editor Settings</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition">✕</button>
            </div>
            <SelectRow label="Font Size"   description="Size of the editor font"        name="fontSize" value={fontSize} options={FONT_SIZES}                     onChange={handleChange} />
            <SelectRow label="Theme"       description="Color theme of the editor"      name="theme"    value={theme}    options={THEMES}                         onChange={handleChange} />
            <SelectRow label="Tab Size"    description="Number of spaces per tab"       name="tabSize"  value={tabSize}  options={TAB_SIZES.map(v => ({value:v, label: `${v} spaces`}))} onChange={handleChange} />
          </div>
        </>
      )}
    </>
  )
}

export default EditorSettings