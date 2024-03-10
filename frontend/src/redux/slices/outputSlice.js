import { createSlice } from "@reduxjs/toolkit";

export const outputSlice = createSlice({
        name: "output",
        initialState: {
                value: null,
        },
        reducers: {
                updateOutput: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateOutput } = outputSlice.actions;
export default outputSlice.reducer;
