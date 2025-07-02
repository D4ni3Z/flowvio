// src/main.tsx
import "./theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // Importa RouterProvider
import { router } from "./routes"; // Importa il nostro router

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Sostituisci <App /> con <RouterProvider /> */}
    <RouterProvider router={router} />
  </StrictMode>
);