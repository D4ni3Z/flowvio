import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { PlusCircle, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';
import type { Estimate } from '../../types';

type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined';

interface EstimateWithClient extends Estimate {
    clients: { name: string; } | null;
}

// Funzione migliorata che restituisce uno stile completo per il Chip
const getStatusChipStyle = (status: EstimateStatus) => {
    const styles = {
        color: '#fff', // Testo bianco per un buon contrasto
        fontWeight: 'bold',
    };
    switch (status) {
        case 'accepted':
            return { ...styles, backgroundColor: '#4caf50' }; // Verde
        case 'sent':
            return { ...styles, backgroundColor: '#2196f3' }; // Blu
        case 'declined':
            return { ...styles, backgroundColor: '#f44336' }; // Rosso
        case 'draft':
        default:
            return { backgroundColor: '#9e9e9e', color: '#000', fontWeight: 'bold' }; // Grigio
    }
};

const EstimatesPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [estimates, setEstimates] = useState<EstimateWithClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stati per il menu delle azioni
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedEstimate, setSelectedEstimate] = useState<EstimateWithClient | null>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, estimate: EstimateWithClient) => {
        setAnchorEl(event.currentTarget);
        setSelectedEstimate(estimate);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEstimate(null);
    };

    const fetchEstimates = async () => {
        if (!user) return;
        try {
            // Non serve più setLoading(true) qui, lo gestiamo nel chiamante
            const { data, error } = await supabase
                .from('estimates')
                .select('*, clients(name)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEstimates(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false); // Spostato qui per essere sicuro che venga eseguito
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchEstimates();
    }, [user]);

    const handleStatusChange = async (newStatus: EstimateStatus) => {
        if (!selectedEstimate) return;

        const { error } = await supabase
            .from('estimates')
            .update({ status: newStatus })
            .eq('id', selectedEstimate.id);

        if (error) {
            setError(error.message);
        } else {
            // Aggiorna lo stato locale per un feedback immediato, poi ricarica
            setEstimates(prev => prev.map(est => est.id === selectedEstimate.id ? { ...est, status: newStatus } : est));
        }
        handleMenuClose();
    };


    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1">{t('estimates_page.title')}</Typography>
                <Button variant="contained" startIcon={<PlusCircle size={18} />} component={Link} to="/estimates/new">
                    {t('estimates_page.add_estimate')}
                </Button>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('estimates_page.table.title')}</TableCell>
                                <TableCell>{t('estimates_page.table.client')}</TableCell>
                                <TableCell>{t('estimates_page.table.status')}</TableCell>
                                <TableCell align="right">{t('estimates_page.table.total')}</TableCell>
                                <TableCell>{t('estimates_page.table.valid_until')}</TableCell>
                                <TableCell align="right">Azioni</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estimates.length > 0 ? (
                                estimates.map((estimate) => (
                                    <TableRow key={estimate.id}>
                                        <TableCell>{estimate.title}</TableCell>
                                        <TableCell>{estimate.clients?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip label={t(`estimate_statuses.${estimate.status}`)} sx={getStatusChipStyle(estimate.status as EstimateStatus)} size="small" />
                                        </TableCell>
                                        <TableCell align="right">€{estimate.total.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(estimate.valid_until).toLocaleDateString(i18n.language)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={(e) => handleMenuClick(e, estimate)}>
                                                <MoreVertical size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">{t('estimates_page.no_estimates')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Stack spacing={2} sx={{ display: { xs: 'block', md: 'none' } }}>
                {estimates.length > 0 ? (
                    estimates.map((estimate) => (
                        <Paper key={estimate.id} sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">{estimate.title}</Typography>
                                <IconButton onClick={(e) => handleMenuClick(e, estimate)} size="small">
                                    <MoreVertical size={20} />
                                </IconButton>
                            </Box>
                            <Typography color="text.secondary">{estimate.clients?.name || 'N/A'}</Typography>
                            <Chip
                                label={t(`estimate_statuses.${estimate.status}`)}
                                sx={{ ...getStatusChipStyle(estimate.status as EstimateStatus), mt: 1 }}
                                size="small"
                            />
                            <Typography variant="h5" align="right" sx={{ mt: 1 }}>€{estimate.total.toFixed(2)}</Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 4 }}>{t('estimates_page.no_estimates')}</Typography>
                )}
            </Stack>

            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleStatusChange('sent')}>{t('estimate_actions.mark_sent')}</MenuItem>
                <MenuItem onClick={() => handleStatusChange('accepted')}>{t('estimate_actions.mark_accepted')}</MenuItem>
                <MenuItem onClick={() => handleStatusChange('declined')}>{t('estimate_actions.mark_declined')}</MenuItem>
                <MenuItem onClick={() => handleStatusChange('draft')}>{t('estimate_actions.mark_draft')}</MenuItem>
            </Menu>
        </Box>
    );
};

export default EstimatesPage;
