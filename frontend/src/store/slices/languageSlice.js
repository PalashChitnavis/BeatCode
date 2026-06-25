import { createSlice } from "@reduxjs/toolkit"

const SUPPORTED_LANGUAGES = ["python", "cpp", "java", "javascript"]

const languageSlice = createSlice({
  name: "language",
  initialState: {
    value: "python",
  },
  reducers: {
    updateLanguage: (state, action) => {
      if (SUPPORTED_LANGUAGES.includes(action.payload)) {
        state.value = action.payload
      }
    },
  },
})

export const { updateLanguage } = languageSlice.actions
export default languageSlice.reducer