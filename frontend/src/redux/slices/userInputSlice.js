import { createSlice } from "@reduxjs/toolkit";

export const userInputSlice = createSlice({
        name: "userInput",
        initialState: {
                value: null,
        },
        reducers: {
                updateUserInput: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updateUserInput } = userInputSlice.actions;
export default userInputSlice.reducer;
