import { createSlice } from "@reduxjs/toolkit";

export const editorThemeSlice = createSlice({
        name: "editorTheme",
        initialState: {
                value: "monokai",
        },
        reducers: {
                updateEditorTheme: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updateEditorTheme } = editorThemeSlice.actions;
export default editorThemeSlice.reducer;
