import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardActions, Button, Switch, Stack, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, description, features, buttonText, popular = false }: { title: string, price: string, description: string, features: string[], buttonText: string, popular?: boolean }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: popular ? 2 : 1, borderColor: popular ? 'primary.main' : 'divider' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                {popular && <Chip label="Most Popular" color="primary" sx={{ mb: 2 }} />}
                <Typography variant="h4" component="h2" gutterBottom>{title}</Typography>
                <Typography variant="h3" component="p" gutterBottom>{price}</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
                <Stack spacing={1.5}>
                    {features.map((feature, index) => (
                        <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                            <Check size={20} />
                            <Typography variant="body1">{feature}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
            <CardActions>
                <Button fullWidth variant={popular ? 'contained' : 'outlined'} color="primary">{buttonText}</Button>
            </CardActions>
        </Card>
    );
};


const PricingPage = () => {
    const { t } = useTranslation();
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = {
        solo: {
            title: t('pricing_page.solo.title'),
            monthlyPrice: `€${t('pricing_page.solo.monthly_price')}`,
            annualPrice: `€${t('pricing_page.solo.annual_price')}`,
            description: t('pricing_page.solo.description'),
            features: [
                t('pricing_page.solo.feature1'),
                t('pricing_page.solo.feature2'),
                t('pricing_page.solo.feature3'),
            ]
        },
        studio: {
            title: t('pricing_page.studio.title'),
            monthlyPrice: `€${t('pricing_page.studio.monthly_price')}`,
            annualPrice: `€${t('pricing_page.studio.annual_price')}`,
            description: t('pricing_page.studio.description'),
            features: [
                t('pricing_page.studio.feature1'),
                t('pricing_page.studio.feature2'),
                t('pricing_page.studio.feature3'),
            ],
            popular: true
        },
        addon: {
            title: t('pricing_page.addon.title'),
            monthlyPrice: `+€${t('pricing_page.addon.monthly_price')}`,
            annualPrice: `+€${t('pricing_page.addon.annual_price')}`,
            description: t('pricing_page.addon.description'),
            features: [
                t('pricing_page.addon.feature1'),
                t('pricing_page.addon.feature2'),
            ]
        }
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
                <Box textAlign="center" sx={{ mb: 8 }}>
                    <Typography variant="h2" component="h1" fontWeight="bold">
                        {t('pricing_page.main_title')}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                        {t('pricing_page.subtitle')}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                        <Typography>{t('pricing_page.monthly')}</Typography>
                        <Switch checked={isAnnual} onChange={(e) => setIsAnnual(e.target.checked)} />
                        <Typography>{t('pricing_page.annual')}</Typography>
                    </Stack>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="stretch">
                    <Box sx={{ width: '100%' }}>
                        <PricingCard
                            title={plans.solo.title}
                            price={isAnnual ? plans.solo.annualPrice : plans.solo.monthlyPrice}
                            description={plans.solo.description}
                            features={plans.solo.features}
                            buttonText={t('pricing_page.cta_button_solo')}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <PricingCard
                            title={plans.studio.title}
                            price={isAnnual ? plans.studio.annualPrice : plans.studio.monthlyPrice}
                            description={plans.studio.description}
                            features={plans.studio.features}
                            buttonText={t('pricing_page.cta_button_studio')}
                            popular={plans.studio.popular}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <PricingCard
                            title={plans.addon.title}
                            price={isAnnual ? plans.addon.annualPrice : plans.addon.monthlyPrice}
                            description={plans.addon.description}
                            features={plans.addon.features}
                            buttonText={t('pricing_page.cta_button_addon')}
                        />
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default PricingPage;