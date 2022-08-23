import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* ONLINE DEPLOYMENT: <BrowserRouter basename="/my-anime-log/" */}
    <BrowserRouter>
      {/* Set up React Router and our routes! Plan them in advance */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
