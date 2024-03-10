import { createSlice } from "@reduxjs/toolkit";

export const toggleOutputSlice = createSlice({
        name: "toggleOutput",
        initialState: {
                value: false,
        },
        reducers: {
                updateToggleOutput: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateToggleOutput } = toggleOutputSlice.actions;
export default toggleOutputSlice.reducer;
