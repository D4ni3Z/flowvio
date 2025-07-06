// La tua interfaccia Client esistente
export interface Client {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    user_id: string;
}

// NUOVA: Interfaccia per una singola voce del preventivo
export interface EstimateItem {
    id?: string; // ID dal database (opzionale, c'è solo dopo il salvataggio)
    temp_id: string; // ID temporaneo lato client per la gestione della lista
    description: string;
    quantity: number;
    unit_price: number;
}

// NUOVA: Interfaccia per il preventivo principale
export interface Estimate {
    id?: string;
    title: string;
    client_id: string;
    user_id: string;
    status: 'draft' | 'sent' | 'accepted' | 'declined';
    valid_until: string; // Formato ISO 8601
    total: number;
}
