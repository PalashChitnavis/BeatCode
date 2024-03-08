import { createSlice } from "@reduxjs/toolkit";

export const practiceStatusSlice = createSlice({
        name: "practiceStatus",
        initialState: {
                value: false,
        },
        reducers: {
                updatePracticeStatus: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updatePracticeStatus } = practiceStatusSlice.actions;
export default practiceStatusSlice.reducer;
