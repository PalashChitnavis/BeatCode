import { createSlice } from "@reduxjs/toolkit";

export const tabSizeSlice = createSlice({
        name: "tabSize",
        initialState: {
                value: "2",
        },
        reducers: {
                updateTabSize: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateTabSize } = tabSizeSlice.actions;
export default tabSizeSlice.reducer;
