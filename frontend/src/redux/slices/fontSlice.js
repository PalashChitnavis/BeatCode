import { createSlice } from "@reduxjs/toolkit";

export const fontSlice = createSlice({
        name: "font",
        initialState: {
                value: "18px",
        },
        reducers: {
                updateFont: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateFont } = fontSlice.actions;
export default fontSlice.reducer;
