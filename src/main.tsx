// src/main.tsx
import "./theme.css";
import './i18n'; // <-- IMPORTA IL FILE DI CONFIGURAZIONE
import { StrictMode, Suspense } from "react"; // Aggiungi Suspense
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from './auth/AuthProvider';
import { CircularProgress, Box } from "@mui/material";

// Un semplice componente di fallback per il caricamento delle traduzioni
const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}> {/* Usa Suspense qui */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  </StrictMode>
);