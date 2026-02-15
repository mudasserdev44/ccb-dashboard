import { useState } from 'react'
import Router from './routes'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { theme } from './Theme'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'
function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
        <ToastContainer />
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default App
