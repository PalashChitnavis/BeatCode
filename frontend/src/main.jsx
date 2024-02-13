/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { BodyProvider } from "./context/BodyProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
        <BodyProvider>
                <App />
        </BodyProvider>
);
