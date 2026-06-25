import { configureStore } from "@reduxjs/toolkit"
import codeReducer     from "./slices/codeSlice"
import outputReducer   from "./slices/outputSlice"
import languageReducer from "./slices/languageSlice"
import userReducer     from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    code:     codeReducer,
    output:   outputReducer,
    language: languageReducer,
    user:     userReducer,
  },
})