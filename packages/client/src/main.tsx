import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './style/theme.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
