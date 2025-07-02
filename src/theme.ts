// src/theme.ts
import { createTheme } from '@mui/material/styles';

const getCssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const getMuiTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            background: {
                default: mode === 'light' ? getCssVar('--light-bg') : getCssVar('--dark-bg'),
                paper: mode === 'light' ? getCssVar('--light-surface') : getCssVar('--dark-surface'),
            },
            text: {
                primary: mode === 'light' ? getCssVar('--light-text-primary') : getCssVar('--dark-text-primary'),
                secondary: mode === 'light' ? getCssVar('--light-text-secondary') : getCssVar('--dark-text-secondary'),
            },
            primary: {
                main: getCssVar('--accent-teal'),
            },
            divider: mode === 'light' ? getCssVar('--light-border') : getCssVar('--dark-border'),
        },
    });
