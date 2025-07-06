import { useState } from 'react';
import {
    Box,
    Drawer,
    useTheme,
    AppBar,
    Toolbar,
    IconButton,
    Stack,
    Typography,
    Button,
    Switch,
    FormControlLabel
} from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Menu as MenuIcon,
    Users,
    FileText,
    LogOut,
    LayoutDashboard,
    Mail // ✅ NUOVO IMPORT
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useThemeContext } from '../../App';

const drawerWidth = 240;

const NavItem = ({
    to,
    icon,
    label,
    onClick
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) => {
    const theme = useTheme();

    const navLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: theme.palette.text.secondary,
        fontWeight: 500,
        transition: 'background-color 0.2s, color 0.2s'
    };

    const activeStyle = {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.text.primary
    };

    return (
        <NavLink
            to={to}
            onClick={onClick}
            style={({ isActive }) =>
                isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle
            }
        >
            <Box component="span" sx={{ mr: 1.5, display: 'inline-flex' }}>{icon}</Box>
            {label}
        </NavLink>
    );
};

const AppDrawerContent = ({ onNavItemClick }: { onNavItemClick?: () => void }) => {
    const { t, i18n } = useTranslation();
    const { logout, user } = useAuth();
    const { mode } = useThemeContext();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img
                    src={mode === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
                    alt="Flowvio Logo"
                    style={{ width: 130 }}
                />
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 4, justifyContent: 'center' }}>
                <Button
                    size="small"
                    onClick={() => changeLanguage('it')}
                    variant={i18n.language.startsWith('it') ? 'contained' : 'outlined'}
                >
                    IT
                </Button>
                <Button
                    size="small"
                    onClick={() => changeLanguage('en')}
                    variant={i18n.language.startsWith('en') ? 'contained' : 'outlined'}
                >
                    EN
                </Button>
            </Stack>

            <Stack component="nav" spacing={1} sx={{ flexGrow: 1 }}>
                <NavItem to="/app" icon={<LayoutDashboard size={20} />} label={t('sidebar.dashboard')} onClick={onNavItemClick} />
                <NavItem to="/app/leads" icon={<Mail size={20} />} label={t('sidebar.leads')} onClick={onNavItemClick} /> {/* ✅ NUOVO LINK */}
                <NavItem to="/app/clients" icon={<Users size={20} />} label={t('sidebar.clients')} onClick={onNavItemClick} />
                <NavItem to="/app/estimates" icon={<FileText size={20} />} label={t('sidebar.estimates')} onClick={onNavItemClick} />
            </Stack>

            <Stack spacing={1}>
                {user && (
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        {t('sidebar.greeting', { email: user.email })}
                    </Typography>
                )}
                <Button variant="outlined" startIcon={<LogOut size={16} />} onClick={logout}>
                    {t('common.logout')}
                </Button>
            </Stack>
        </Box>
    );
};

const MainLayout = () => {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { toggleColorMode, mode } = useThemeContext();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <FormControlLabel
                        control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} />}
                        label={mode === 'light' ? 'Light' : 'Dark'}
                    />
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    <AppDrawerContent onNavItemClick={handleDrawerToggle} />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: `1px solid ${theme.palette.divider}`
                        }
                    }}
                    open
                >
                    <AppDrawerContent />
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;