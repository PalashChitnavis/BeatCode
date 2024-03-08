import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
        name: "language",
        initialState: {
                value: "java",
        },
        reducers: {
                updateLanguage: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updateLanguage } = languageSlice.actions;
export default languageSlice.reducer;
