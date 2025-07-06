import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainLayout from "../components/templates/MainLayout";
import PublicLayout from "../components/templates/PublicLayout";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import ClientsPage from "../pages/ClientsPage";
import EstimatesPage from "../pages/estimates/EstimatesPage";
import CreateEstimatePage from "../pages/estimates/CreateEstimatePage";
import HomePage from "../pages/public/HomePage";
import FeaturesPage from "../pages/public/FeaturesPage";
import PricingPage from "../pages/public/PricingPage";
import BlogPage from "../pages/public/BlogPage";
import LegalPage from "../pages/public/LegalPage";
import ProtectedRoute from "./ProtectedRoute";
import SignUpPage from "../pages/public/SignUpPage"; // ✅ NUOVO IMPORT
import LeadsPage from "../pages/LeadsPage"; // ✅ NUOVO IMPORT
import ContactPage from "../pages/public/ContactPage"; // ✅ NUOVO IMPORT

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // Rotte Pubbliche (sito vetrina)
            {
                element: <PublicLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: "features",
                        element: <FeaturesPage />,
                    },
                    {
                        path: "pricing",
                        element: <PricingPage />,
                    },
                    {
                        path: "blog",
                        element: <BlogPage />,
                    },
                    {
                        path: "legal",
                        element: <LegalPage />,
                    },
                ],
            },
            // ✅ Pagina di Contatto (autonoma, fuori da PublicLayout)
            {
                path: "contact/:userId",
                element: <ContactPage />,
            },
            // Pagina di Login (autonoma)
            {
                path: "login",
                element: <LoginPage />,
            },
            // Pagina di Registrazione
            {
                path: "signup",
                element: <SignUpPage />,
            },
            // Rotte dell'Applicazione Gestionale (protette e sotto /app)
            {
                path: "app",
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <MainLayout />,
                        children: [
                            {
                                index: true,
                                element: <DashboardPage />,
                            },
                            {
                                path: "clients",
                                element: <ClientsPage />,
                            },
                            {
                                path: "estimates",
                                element: <EstimatesPage />,
                            },
                            {
                                path: "estimates/new",
                                element: <CreateEstimatePage />,
                            },
                            {
                                path: "leads",
                                element: <LeadsPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);