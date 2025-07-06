import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthProvider';

// Definiamo un tipo per i dati dei lead
interface Lead {
    id: string;
    created_at: string;
    name: string;
    email: string;
    event_date: string | null;
    status: string;
}

const LeadsPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setLeads(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [user]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1">
                    {t('leads_page.title')}
                </Typography>
            </Box>

            {/* Vista Tabella per Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('leads_page.table.name')}</TableCell>
                                <TableCell>{t('leads_page.table.email')}</TableCell>
                                <TableCell>{t('leads_page.table.event_date')}</TableCell>
                                <TableCell>{t('leads_page.table.status')}</TableCell>
                                <TableCell>{t('leads_page.table.received_on')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.length > 0 ? (
                                leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>{lead.name}</TableCell>
                                        <TableCell>{lead.email}</TableCell>
                                        <TableCell>{lead.event_date ? new Date(lead.event_date).toLocaleDateString(i18n.language) : '-'}</TableCell>
                                        <TableCell><Chip label={lead.status} size="small" color="info" /></TableCell>
                                        <TableCell>{new Date(lead.created_at).toLocaleDateString(i18n.language)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">{t('leads_page.no_leads')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Vista Card per Mobile */}
            <Stack spacing={2} sx={{ display: { xs: 'block', md: 'none' } }}>
                {leads.length > 0 ? (
                    leads.map((lead) => (
                        <Paper key={lead.id} sx={{ p: 2 }}>
                            <Typography variant="h6">{lead.name}</Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>{lead.email}</Typography>
                            <Chip label={lead.status} size="small" color="info" sx={{ mb: 1 }} />
                            <Typography variant="body2">
                                {t('leads_page.table.event_date')}: {lead.event_date ? new Date(lead.event_date).toLocaleDateString(i18n.language) : '-'}
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 4 }}>{t('leads_page.no_leads')}</Typography>
                )}
            </Stack>
        </Box>
    );
};

export default LeadsPage;