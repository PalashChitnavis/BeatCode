import { createSlice } from "@reduxjs/toolkit";

export const userInputSlice = createSlice({
        name: "userInput",
        initialState: {
                value: null,
        },
        reducers: {
                updateUserInput: (state, action) => {
                        state.value = action.payload;
                },
        },
});

export const { updateUserInput } = userInputSlice.actions;
export default userInputSlice.reducer;
