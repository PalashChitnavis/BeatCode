import { createSlice } from "@reduxjs/toolkit";

export const practiceStatusSlice = createSlice({
        name: "practiceStatus",
        initialState: {
                value: false,
        },
        reducers: {
                updatePracticeStatus: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updatePracticeStatus } = practiceStatusSlice.actions;
export default practiceStatusSlice.reducer;
