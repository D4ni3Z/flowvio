import { useState } from 'react';
import { Box, Typography, Button, TextField, Stack, Alert, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            setSuccess(true);
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
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                {success ? (
                    <Box textAlign="center">
                        <Typography variant="h5" gutterBottom>{t('signup_page.success_title')}</Typography>
                        <Typography color="text.secondary">{t('signup_page.success_message')}</Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                            {t('signup_page.title')}
                        </Typography>
                        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label={t('client_form.email')}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label={t('signup_page.password_label')}
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
                                    disabled={loading}
                                    fullWidth
                                    size="large"
                                >
                                    {loading ? t('signup_page.loading_button') : t('signup_page.submit_button')}
                                </Button>
                            </Stack>
                        </Box>
                    </>
                )}
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        {t('signup_page.back_to_login')}
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default SignUpPage;