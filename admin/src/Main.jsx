import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Main App component
import "./index.css"; // Global styles

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)