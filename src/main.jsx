import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Main App component
import "./index.css"; // Global styles
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { ToastContainer } from "react-toastify"; // Toast notifications
import StoreContextProvider from "./context/StoreContext";
//disabled react strict mode because it was double rendering

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* Wrap App with BrowserRouter */}
    <StoreContextProvider>
      <App />
      <ToastContainer /> {/* Toast notifications */}
    </StoreContextProvider>
  </BrowserRouter>
);
