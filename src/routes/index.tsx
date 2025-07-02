// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainLayout from "../components/templates/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // Rotte pubbliche (es. Login)
            {
                path: "login",
                element: <LoginPage />,
            },
            // Rotte protette che usano il MainLayout
            {
                path: "/", // Impostiamo la dashboard come home per ora
                element: <MainLayout />,
                children: [
                    {
                        index: true, // Questo rende la dashboard la rotta di default per "/"
                        element: <DashboardPage />,
                    },
                    // ... qui aggiungeremo altre pagine come "clienti", "progetti", etc.
                ],
            },
        ],
    },
]);