// Stores the language selected for compilation and syntax highlighting.
import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
        name: "language",
        initialState: {
                value: "java",
        },
        reducers: {
                updateLanguage: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateLanguage } = languageSlice.actions;
export default languageSlice.reducer;
