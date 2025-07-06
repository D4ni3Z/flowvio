import { useState } from 'react';
import { Box, TextField, Stack, Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Client } from '../../types';

interface ClientFormProps {
    onSubmit: (clientData: Omit<Client, 'id' | 'created_at' | 'user_id'>) => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
}

const ClientForm = ({ onSubmit, onCancel, loading, error }: ClientFormProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ name, email, phone });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label={t('client_form.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label={t('client_form.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label={t('client_form.phone')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                    <Button onClick={onCancel} color="secondary">
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? t('common.saving') : t('common.save')}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ClientForm;
