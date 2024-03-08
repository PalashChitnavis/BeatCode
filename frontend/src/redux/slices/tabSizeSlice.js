import { createSlice } from "@reduxjs/toolkit";

export const tabSizeSlice = createSlice({
        name: "tabSize",
        initialState: {
                value: "2",
        },
        reducers: {
                updateTabSize: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updateTabSize } = tabSizeSlice.actions;
export default tabSizeSlice.reducer;
