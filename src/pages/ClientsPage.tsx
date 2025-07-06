import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import { MailPlus } from 'lucide-react';
import { useSnackbar } from 'notistack';

// CORREZIONE FINALE DEI PERCORSI
import { supabase } from '../lib/supabaseClient';
import type { Client } from '../types';
import AddClientModal from '@/components/AddClientModal';

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invitingClientId, setInvitingClientId] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const fetchClients = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            // NOTA: Controlla che 'user_id_photographer' sia il nome corretto della colonna
            // nella tua tabella 'clients' che collega il cliente al fotografo.
            const { data, error } = await supabase.from('clients').select('*').eq('user_id_photographer', user.id).order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching clients:', error);
                enqueueSnackbar('Errore nel caricamento dei clienti', { variant: 'error' });
            } else if (data) {
                setClients(data);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleInviteClient = async (client: Client) => {
        if (!client.id || !client.email || !client.name) {
            enqueueSnackbar("Informazioni del cliente incomplete per l'invito.", { variant: 'error' });
            return;
        }

        setInvitingClientId(client.id);

        try {
            const { data, error } = await supabase.functions.invoke('invite-client', {
                body: {
                    client_id: client.id,
                    email: client.email,
                    name: client.name,
                },
            });

            if (error) throw error;
            if (data && data.error) throw new Error(data.error);

            enqueueSnackbar('Invito inviato con successo!', { variant: 'success' });
            await fetchClients();

        } catch (error: any) {
            console.error('Error inviting client:', error);
            const errorMessage = error.message.includes('Un utente con questa email esiste già')
                ? 'Un utente con questa email è già registrato.'
                : `Errore durante l'invio dell'invito.`;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setInvitingClientId(null);
        }
    };


    if (loading && clients.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Clienti</Typography>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                    Aggiungi Cliente
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefono</TableCell>
                            <TableCell align="right">Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    {invitingClientId === client.id ? (
                                        <CircularProgress size={24} />
                                    ) : client.user_id ? (
                                        <Typography variant="caption" color="text.secondary">Invitato</Typography>
                                    ) : (
                                        <Tooltip title="Invia invito al portale">
                                            <IconButton onClick={() => handleInviteClient(client)} size="small">
                                                <MailPlus />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClientAdded={fetchClients}
            />
        </Box>
    );
};

export default ClientsPage;