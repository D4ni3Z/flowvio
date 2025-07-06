import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Stack, Alert, CircularProgress, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const ContactPage = () => {
    const { t } = useTranslation();
    const { userId } = useParams<{ userId: string }>(); // Recupera l'ID del fotografo dall'URL

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(null);
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // URL della nostra Edge Function
            const functionUrl = `https://amtqpyibxrtrshakuvep.supabase.co/functions/v1/contact-form`;

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    event_date: eventDate ? eventDate.format('YYYY-MM-DD') : null,
                    message,
                    user_id: userId, // L'ID del fotografo a cui associare il lead
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            }

            setSuccess(true);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 120px)' }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    {success ? (
                        <Box textAlign="center">
                            <Typography variant="h4" component="h1" gutterBottom>{t('contact_page.success_title')}</Typography>
                            <Typography color="text.secondary">{t('contact_page.success_message')}</Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                                {t('contact_page.title')}
                            </Typography>
                            <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                                {t('contact_page.subtitle')}
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <TextField label={t('client_form.name')} value={name} onChange={e => setName(e.target.value)} required />
                                    <TextField label={t('client_form.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                    <TextField label={t('client_form.phone')} value={phone} onChange={e => setPhone(e.target.value)} />
                                    <DatePicker label={t('contact_page.event_date_label')} value={eventDate} onChange={setEventDate} />
                                    <TextField
                                        label={t('contact_page.message_label')}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required
                                        multiline
                                        rows={4}
                                    />
                                    {error && <Alert severity="error">{error}</Alert>}
                                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                                        {loading ? <CircularProgress size={24} /> : t('contact_page.submit_button')}
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ContactPage;