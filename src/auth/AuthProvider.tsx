// src/auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
// Riga 3, CORRETTA
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Definiamo il tipo per il nostro contesto
interface AuthContextType {
    session: Session | null;
    user: User | null;
    logout: () => Promise<void>;
}

// Creiamo il contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Recupera la sessione iniziale se esiste
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        // Ascolta i cambiamenti dello stato di autenticazione
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        // Pulisce il listener quando il componente viene smontato
        return () => subscription.unsubscribe();
    }, []);

    // Funzione di logout
    const logout = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizzato per accedere facilmente al contesto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};