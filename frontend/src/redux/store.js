// Combines editor and UI state slices into the application's Redux store.
import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./slices/codeSlice";
import outputReducer from "./slices/outputSlice";
import userInputReducer from "./slices/userInputSlice";
import languageReducer from "./slices/languageSlice";
import fontReducer from "./slices/fontSlice";
import tabSizeReducer from "./slices/tabSizeSlice";
import editorThemeReducer from "./slices/editorThemeSlice";
import toggleOutputReducer from "./slices/toggleOutput";
import practiceStatusReducer from "./slices/practiceStatusSlice";
export const store = configureStore({
        reducer: {
                code: codeReducer,
                output: outputReducer,
                userInput: userInputReducer,
                language: languageReducer,
                font: fontReducer,
                tabSize: tabSizeReducer,
                editorTheme: editorThemeReducer,
                toggleOutput: toggleOutputReducer,
                practiceStatus: practiceStatusReducer,
        },
});
