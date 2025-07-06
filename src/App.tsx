import { useMemo, useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getMuiTheme } from './theme';
// Import per il Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDark ? 'dark' : 'light');
  }, []);

  const theme = useMemo(() => getMuiTheme(mode), [mode]);

  const handleToggle = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    // Avvolgiamo tutto nel LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Outlet context={{ toggleColorMode: handleToggle, mode }} />
        </main>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export function useThemeContext() {
  return useOutletContext<{ toggleColorMode: () => void; mode: 'light' | 'dark' }>();
}