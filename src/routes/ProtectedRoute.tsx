import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const ProtectedRoute = () => {
    const { session } = useAuth();
    // Prende il contesto passato dall'Outlet genitore (quello in App.tsx)
    const context = useOutletContext();

    if (!session) {
        // Se non c'è sessione, reindirizza al login
        return <Navigate to="/login" replace />;
    }

    // Se la sessione esiste, renderizza il prossimo Outlet (che conterrà MainLayout)
    // e passa il contesto ricevuto, in modo che MainLayout possa usarlo.
    return <Outlet context={context} />;
};

export default ProtectedRoute;
