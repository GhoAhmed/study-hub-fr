import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e1e2e",
            color: "#f0f0ff",
            border: "1px solid #2a2a3d",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontFamily: "'DM Sans', sans-serif",
            padding: "12px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
          success: {
            iconTheme: { primary: "#00e5b0", secondary: "#1e1e2e" },
            style: {
              background: "#1e1e2e",
              border: "1px solid rgba(0,229,176,0.3)",
            },
          },
          error: {
            iconTheme: { primary: "#ff6b6b", secondary: "#1e1e2e" },
            style: {
              background: "#1e1e2e",
              border: "1px solid rgba(255,107,107,0.3)",
            },
          },
          loading: {
            iconTheme: { primary: "#6c47ff", secondary: "#1e1e2e" },
            style: {
              background: "#1e1e2e",
              border: "1px solid rgba(108,71,255,0.3)",
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
