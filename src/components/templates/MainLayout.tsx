// src/components/templates/MainLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

// Placeholder per la futura Sidebar
const Sidebar = () => (
    <Box
        sx={{
            width: '240px',
            height: '100vh',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            p: 2,
        }}
    >
        Flowvio Menu
    </Box>
);

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: 'calc(100% - 240px)',
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;