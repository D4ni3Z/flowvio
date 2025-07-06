import { Box, Container, Typography, Paper, useTheme, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Zap, Heart, BarChart, CheckCircle } from 'lucide-react';

// Componente per una singola feature
const FeatureDetail = ({ icon, title, description, points }: { icon: React.ReactNode, title: string, description: string, points: string[] }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box color="primary.main">{icon}</Box>
                <Typography variant="h4" component="h3">{title}</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                {description}
            </Typography>
            <Stack spacing={1}>
                {points.map((point, index) => (
                    <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircle size={20} color={theme.palette.success.main} />
                        <Typography>{point}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
};


const FeaturesPage = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <Zap size={40} />,
            title: t('features_page.automation.title'),
            description: t('features_page.automation.description'),
            points: [
                t('features_page.automation.point1'),
                t('features_page.automation.point2'),
                t('features_page.automation.point3'),
            ]
        },
        {
            icon: <Heart size={40} />,
            title: t('features_page.experience.title'),
            description: t('features_page.experience.description'),
            points: [
                t('features_page.experience.point1'),
                t('features_page.experience.point2'),
                t('features_page.experience.point3'),
            ]
        },
        {
            icon: <BarChart size={40} />,
            title: t('features_page.growth.title'),
            description: t('features_page.growth.description'),
            points: [
                t('features_page.growth.point1'),
                t('features_page.growth.point2'),
                t('features_page.growth.point3'),
            ]
        }
    ];

    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
                <Box textAlign="center" sx={{ mb: 8 }}>
                    <Typography variant="h2" component="h1" fontWeight="bold">
                        {t('features_page.main_title')}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                        {t('features_page.subtitle')}
                    </Typography>
                </Box>

                {/* Layout riscritto con Stack per risolvere il problema */}
                <Stack spacing={4}>
                    {features.map((feature, index) => (
                        <FeatureDetail key={index} {...feature} />
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default FeaturesPage;