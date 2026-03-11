import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthProvider } from './context/AuthContext'; // Importar solo el Provider
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './styles/global.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/index';
import './App.css';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Header />
            <Box sx={{ flex: 1, bgcolor: 'background.paper', color: 'text.primary', p: 3, pt: '64px' }}>
              <AppRouter />
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;