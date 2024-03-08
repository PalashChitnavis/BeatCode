import { createSlice } from "@reduxjs/toolkit";

export const codeSlice = createSlice({
        name: "code",
        initialState: {
                value: null,
        },
        reducers: {
                updateCode: (state, action) => {
                        state.value = action.payload;
                        console.log(state.value);
                },
        },
});

export const { updateCode } = codeSlice.actions;
export default codeSlice.reducer;
