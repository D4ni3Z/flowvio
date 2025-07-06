import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Heart, BarChart } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Box textAlign="center" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box color="primary.main" mb={2} flexShrink={0}>{icon}</Box>
        <Typography variant="h6" component="h3" gutterBottom flexShrink={0}>{title}</Typography>
        <Typography color="text.secondary" flexGrow={1}>{description}</Typography>
    </Box>
);

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ overflowX: 'hidden' }}> {/* MODIFICA: Impedisce lo scroll orizzontale */}
            {/* Sezione Hero con Video Background */}
            <Box sx={{ position: 'relative', overflow: 'hidden', color: 'white' }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline // Importante per l'autoplay su mobile
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        objectFit: 'cover',
                        zIndex: -2,
                    }}
                >
                    {/* SOSTITUISCI QUESTO SRC con il percorso del tuo video in /public */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-wedding-photographer-taking-pictures-of-a-couple-4295-large.mp4" type="video/mp4" />
                </video>
                {/* Overlay scuro per la leggibilità */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: -1,
                }} />
                <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ fontSize: { xs: '2.2rem', sm: '3.5rem', md: '4rem' }, overflowWrap: 'break-word' }}
                    >
                        {t('homepage.hero.title')}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1rem', md: '1.25rem' } }}
                    >
                        {t('homepage.hero.subtitle')}
                    </Typography>
                    <Button component={Link} to="/app" variant="contained" size="large">
                        {t('homepage.hero.cta_button')}
                    </Button>
                </Container>
            </Box>

            {/* Sezione Features */}
            <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={5}
                        alignItems="stretch"
                        justifyContent="center"
                    >
                        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                            <FeatureCard
                                icon={<Zap size={40} />}
                                title={t('homepage.features.one.title')}
                                description={t('homepage.features.one.description')}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                            <FeatureCard
                                icon={<Heart size={40} />}
                                title={t('homepage.features.two.title')}
                                description={t('homepage.features.two.description')}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                            <FeatureCard
                                icon={<BarChart size={40} />}
                                title={t('homepage.features.three.title')}
                                description={t('homepage.features.three.description')}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;