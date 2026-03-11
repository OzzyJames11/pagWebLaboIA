import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // Activamos el modo oscuro
        primary: {
            main: '#18052F', // Morado oscuro principal
        },
        secondary: {
            main: '#9B2EF4', // Morado brillante para acentos
        },
        background: {
            default: '#0B0019', // Fondo gris oscuro
            paper: '#18052F', // Fondos de tarjetas y modales
        },
        text: {
            primary: '#ffffff', // Texto principal en blanco
            secondary: '#c0a8ff', // Texto en morado claro
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        body1: {
            fontSize: '0.9rem',
            color: '#ffffff',
            fontWeight: 100,
        },
        h3: {
          fontSize: '3rem',
          fontWeight: 500,
          color: '#ffffff',
        },
        h4: {
            fontSize: '1.5rem',
            color: '#c0a8ff',
            fontWeight: 500,
        },
        h5: {
          fontSize: '1.3rem',
          color: '#c0a8ff',
          fontWeight: 300,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#9B2EF4', // Color del botón principal
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#7500c4', // Un poco más oscuro al pasar el mouse
                    }
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#18052F', // Color de la barra de navegación
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                stickyHeader: {
                backgroundColor: '#c0a8ff', // fondo claro para todos los stickyHeader
                color: '#000000ff',
                },
            },
        },
    },
});

export default theme;

