// src/pages/LoginPage.tsx
import { Box, Typography, Button } from '@mui/material';
import { LogIn } from 'lucide-react'; // Usiamo le nostre nuove icone!

const LoginPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login a Flowvio
            </Typography>
            <Button variant="contained" startIcon={<LogIn size={18} />}>
                Accedi
            </Button>
        </Box>
    );
};

export default LoginPage;