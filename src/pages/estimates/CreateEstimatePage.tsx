import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert, Autocomplete, TextField, Button, AppBar, Toolbar, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';
import type { Client, EstimateItem } from '../../types';
import dayjs from 'dayjs';
import EstimateItemsManager from '../../components/organisms/EstimateItemsManager';

const CreateEstimatePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stati per il form
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [title, setTitle] = useState('');
    const [validUntil, setValidUntil] = useState<dayjs.Dayjs | null>(dayjs().add(30, 'day'));
    const [items, setItems] = useState<EstimateItem[]>([
        { temp_id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });

    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase.from('clients').select('*').eq('user_id', user.id);
                if (error) throw error;
                setClients(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, [user]);

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    };

    const handleSaveEstimate = async () => {
        if (!user || !selectedClient || !validUntil) {
            setSnackbar({ open: true, message: t('create_estimate_page.errors.missing_data') });
            return;
        }
        setIsSaving(true);
        setError(null);

        try {
            const total = calculateTotal();
            const { data: estimateData, error: estimateError } = await supabase
                .from('estimates')
                .insert({
                    client_id: selectedClient.id,
                    user_id: user.id,
                    title,
                    status: 'draft',
                    valid_until: validUntil.format('YYYY-MM-DD'),
                    total,
                })
                .select()
                .single();

            if (estimateError) throw estimateError;

            const estimateItemsToInsert = items.map(item => ({
                estimate_id: estimateData.id,
                user_id: user.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));

            const { error: itemsError } = await supabase.from('estimate_items').insert(estimateItemsToInsert);
            if (itemsError) throw itemsError;

            navigate('/estimates');
        } catch (err: any) {
            setSnackbar({ open: true, message: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <Box sx={{ pb: '80px' }}>
            <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
                {t('create_estimate_page.title')}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    {t('create_estimate_page.details_title')}
                </Typography>
                <Box component="form" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Autocomplete
                        options={clients}
                        getOptionLabel={(option) => option.name}
                        value={selectedClient}
                        onChange={(_event, newValue) => setSelectedClient(newValue)}
                        renderInput={(params) => <TextField {...params} label={t('create_estimate_page.client_label')} />}
                    />
                    <TextField
                        label={t('create_estimate_page.title_label')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <DatePicker
                        label={t('create_estimate_page.valid_until_label')}
                        value={validUntil}
                        onChange={(newValue) => setValidUntil(newValue)}
                    />
                </Box>
            </Paper>

            <EstimateItemsManager items={items} onItemsChange={setItems} />

            <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0, bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, textAlign: 'right', pr: 2 }}>
                        <Typography variant="h6">{t('create_estimate_page.total')}: €{calculateTotal().toFixed(2)}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSaveEstimate}
                        disabled={isSaving}
                    >
                        {isSaving ? t('create_estimate_page.saving_button') : t('create_estimate_page.save_button')}
                    </Button>
                </Toolbar>
            </AppBar>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </Box>
    );
};

export default CreateEstimatePage;
