import { Box, Typography, TextField, IconButton, Button, Stack, Paper, Divider } from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { EstimateItem } from '../../types';

interface EstimateItemsManagerProps {
    items: EstimateItem[];
    onItemsChange: (items: EstimateItem[]) => void;
}

// Definiamo un tipo locale per la gestione del form, dove i numeri possono essere stringhe durante l'editing
type EditableItem = Omit<EstimateItem, 'quantity' | 'unit_price'> & {
    quantity: string;
    unit_price: string;
};

const EstimateItemsManager = ({ items, onItemsChange }: EstimateItemsManagerProps) => {
    const { t } = useTranslation();
    const [editableItems, setEditableItems] = useState<EditableItem[]>([]);

    // Sincronizza lo stato locale quando gli item dal genitore cambiano
    useEffect(() => {
        setEditableItems(items.map(item => ({
            ...item,
            quantity: String(item.quantity),
            unit_price: String(item.unit_price),
        })));
    }, [items]);

    // Gestisce il cambiamento del testo negli input
    const handleLocalChange = (index: number, field: keyof EditableItem, value: string) => {
        const newEditableItems = [...editableItems];
        (newEditableItems[index] as any)[field] = value;
        setEditableItems(newEditableItems);
    };

    // Gestisce la formattazione e l'aggiornamento del genitore quando si esce dal campo
    const handleBlur = (index: number, field: 'quantity' | 'unit_price') => {
        const newItems = [...items];
        const value = parseFloat(editableItems[index][field]) || 0;
        newItems[index][field] = value;
        onItemsChange(newItems);
    };

    const handleAddItem = () => {
        onItemsChange([
            ...items,
            { temp_id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
        ]);
    };

    const handleRemoveItem = (temp_id: string) => {
        onItemsChange(items.filter((item) => item.temp_id !== temp_id));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.quantity * item.unit_price, 0);
    };

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {t('create_estimate_page.items_title')}
            </Typography>
            <Stack spacing={2}>
                {editableItems.map((item, index) => (
                    <Stack key={item.temp_id} direction="row" spacing={2} alignItems="center">
                        <TextField
                            label={t('create_estimate_page.item.description')}
                            value={item.description}
                            onChange={(e) => handleLocalChange(index, 'description', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('create_estimate_page.item.quantity')}
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLocalChange(index, 'quantity', e.target.value)}
                            onBlur={() => handleBlur(index, 'quantity')}
                            sx={{ width: 120 }}
                        />
                        <TextField
                            label={t('create_estimate_page.item.unit_price')}
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleLocalChange(index, 'unit_price', e.target.value)}
                            onBlur={() => handleBlur(index, 'unit_price')}
                            sx={{ width: 150 }}
                        />
                        <Typography sx={{ width: 100, textAlign: 'right' }}>
                            €{(items[index]?.quantity * items[index]?.unit_price || 0).toFixed(2)}
                        </Typography>
                        <IconButton onClick={() => handleRemoveItem(item.temp_id)} color="error">
                            <Trash2 size={20} />
                        </IconButton>
                    </Stack>
                ))}
            </Stack>
            <Button onClick={handleAddItem} sx={{ mt: 2 }}>
                {t('create_estimate_page.add_item_button')}
            </Button>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="h5">
                    {t('create_estimate_page.total')}: €{calculateTotal().toFixed(2)}
                </Typography>
            </Box>
        </Paper>
    );
};

export default EstimateItemsManager;