const InputArea = ({ value, onChange }) => (
  <div className="flex flex-col h-full">
    <p className="text-xs text-gray-400 font-medium px-1 pb-1">Stdin</p>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Input goes here..."
      className="flex-1 w-full bg-gray-800 text-gray-200 text-sm font-mono border border-gray-700 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-500 transition placeholder-gray-600"
      spellCheck={false}
    />
  </div>
)

export default InputArea