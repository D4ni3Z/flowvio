import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography variant="h2" component="h1" fontWeight="bold">
                    {t('blog_page.title')}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                    {t('blog_page.subtitle')}
                </Typography>
            </Container>
        </Box>
    );
};

export default BlogPage;
