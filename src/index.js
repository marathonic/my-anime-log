import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* If required by deployment, next line --> <BrowserRouter basename="/myanimelog/" */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
