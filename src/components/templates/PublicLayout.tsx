import { AppBar, Box, Button, Container, Stack, Toolbar, Typography, Switch, FormControlLabel, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../App';
import { MoreVertical, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
    const { t, i18n } = useTranslation();
    const { mode, toggleColorMode } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleMenuClose();
    };

    const handleToggleAndCloseMenu = () => {
        toggleColorMode();
        handleMenuClose();
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Navbar Pubblica */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Logo */}
                        <Box sx={{ flexShrink: 0 }}>
                            <Link to="/">
                                <img
                                    src={mode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
                                    alt="Flowvio Logo"
                                    style={{ height: 45, verticalAlign: 'middle' }}
                                />
                            </Link>
                        </Box>

                        {/* Gruppo di Azioni per Desktop */}
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ display: { xs: 'none', md: 'flex' } }}
                        >
                            <Button component={Link} to="/features" sx={{ fontWeight: 500 }}>
                                {t('public_navbar.features')}
                            </Button>
                            <Button component={Link} to="/pricing" sx={{ fontWeight: 500 }}>
                                {t('public_navbar.pricing')}
                            </Button>
                            <Button component={Link} to="/blog" sx={{ fontWeight: 500 }}>
                                {t('public_navbar.blog')}
                            </Button>
                            <Button component={Link} to="/app" variant="contained" color="primary" sx={{ whiteSpace: 'nowrap' }}>
                                {t('public_navbar.login')}
                            </Button>
                            <Button size="small" onClick={() => changeLanguage('it')} variant={i18n.language.startsWith('it') ? 'contained' : 'outlined'}>IT</Button>
                            <Button size="small" onClick={() => changeLanguage('en')} variant={i18n.language.startsWith('en') ? 'contained' : 'outlined'}>EN</Button>
                            <FormControlLabel
                                control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} size="small" />}
                                label={mode === 'light' ? 'Light' : 'Dark'}
                                sx={{ ml: 1 }}
                            />
                        </Stack>

                        {/* Icona Menu per Mobile */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton
                                color="inherit"
                                onClick={handleMenuOpen}
                            >
                                <MoreVertical />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Menu a comparsa per Mobile */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/features" onClick={handleMenuClose}>
                    {t('public_navbar.features')}
                </MenuItem>
                <MenuItem component={Link} to="/pricing" onClick={handleMenuClose}>
                    {t('public_navbar.pricing')}
                </MenuItem>
                <MenuItem component={Link} to="/blog" onClick={handleMenuClose}>
                    {t('public_navbar.blog')}
                </MenuItem>
                <MenuItem component={Link} to="/app" onClick={handleMenuClose}>
                    {t('public_navbar.login')}
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('it')}>Italiano</MenuItem>
                <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                <MenuItem onClick={handleToggleAndCloseMenu}>
                    <ListItemIcon>
                        {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </ListItemIcon>
                    <ListItemText>{mode === 'dark' ? t('public_navbar.light_mode') : t('public_navbar.dark_mode')}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Contenuto della Pagina */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
                        <Button component={Link} to="/legal" size="small">{t('public_footer.legal')}</Button>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Flowvio. {t('public_footer.rights_reserved')}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;