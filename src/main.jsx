import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store/index.js";
import { Provider } from "react-redux";
// Handle extension-related errors in console
const originalConsoleError = console.error;
console.error = function (...args) {
  // Filter out extension errors related to back/forward cache
  if (
    args[0]?.includes?.("extension") ||
    args[0]?.includes?.("port") ||
    (typeof args[0] === "string" && args[0].includes("back/forward cache"))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
