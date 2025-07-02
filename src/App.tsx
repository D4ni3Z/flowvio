import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Switch, FormControlLabel, Box } from '@mui/material';
import { getMuiTheme } from './theme';
import { Outlet } from 'react-router-dom'; // React Router

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Rileva la preferenza di sistema al primo caricamento
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDark ? 'dark' : 'light');
  }, []);

  const theme = useMemo(() => getMuiTheme(mode), [mode]);

  const handleToggle = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Toggle in alto a destra */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1301 }}>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={handleToggle} />}
          label={mode === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        />
      </Box>

      {/* Area centrale gestita da React Router */}
      <main>
        <Outlet />
      </main>
    </ThemeProvider>
  );
}
