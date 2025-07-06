import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Alert,
    Paper,
    useTheme
} from '@mui/material';
import { LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate('/app');

        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 2
            }}
        >
            <Paper sx={{ p: { xs: 2, sm: 4 }, width: '100%', maxWidth: 400 }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    {t('login_page.title')}
                </Typography>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            label={t('login_page.email_label')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label={t('login_page.password_label')}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<LogIn size={18} />}
                            disabled={loading}
                            fullWidth
                            size="large"
                        >
                            {loading ? t('login_page.loading_button') : t('login_page.submit_button')}
                        </Button>
                    </Stack>
                </Box>
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    {t('login_page.no_account')}{' '}
                    <Link to="/signup" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                        {t('login_page.register_now')}
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginPage;