import { createTheme } from '@mui/material/styles';

// Definiamo i colori direttamente in JavaScript per la massima robustezza.
// Questo elimina la dipendenza dal file theme.css per la logica del tema.
const colors = {
    teal: '#00a0b0',
    light: {
        bg: '#ffffff',
        surface: '#f5f5f5',
        textPrimary: '#111111',
        textSecondary: '#4a4a4a',
        border: '#e0e0e0',
    },
    dark: {
        bg: '#0b0b0b',
        surface: '#1a1a1a',
        textPrimary: '#ffffff',
        textSecondary: '#d0d0d0',
        border: '#333333',
    }
};

export const getMuiTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: colors.teal,
            },
            ...(mode === 'light'
                ? {
                    // Palette per la light mode
                    background: {
                        default: colors.light.bg,
                        paper: colors.light.surface,
                    },
                    text: {
                        primary: colors.light.textPrimary,
                        secondary: colors.light.textSecondary,
                    },
                    divider: colors.light.border,
                }
                : {
                    // Palette per la dark mode
                    background: {
                        default: colors.dark.bg,
                        paper: colors.dark.surface,
                    },
                    text: {
                        primary: colors.dark.textPrimary,
                        secondary: colors.dark.textSecondary,
                    },
                    divider: colors.dark.border,
                }),
        },
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ].join(','),
        },
    });