import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <>
            <Typography variant="h3" component="h1" gutterBottom>
                {t('sidebar.dashboard')}
            </Typography>
            <Typography>
                {t('dashboard_page.welcome')}{' '}
                <strong>{user?.email}</strong>.
            </Typography>
        </>
    );
};

export default DashboardPage;
