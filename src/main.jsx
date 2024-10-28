import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.context.jsx";
import { IdeProvider } from "./context/IdeProvider.contest.jsx";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IdeProvider>
          <ToastContainer />
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </IdeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
