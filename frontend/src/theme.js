// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#001f3e', // Color principal
//         },
//         secondary: {
//             main: '#ff4081', // Color secundario
//         },
//     },
//     typography: {
//         // fontFamily: 'Poppins, Arial, sans-serif',
// // creo que lo siguiente no es necesario

//         // body2: {
//         //     // fontFamily: 'Poppins, Arial, sans-serif', // Define la fuente para body2
//         //     fontSize: '0.875rem', // Tamaño de fuente por defecto para body2
//         //     fontWeight: 400, // Peso de la fuente
//         // },
//         // // Puedes personalizar otras variantes si es necesario
//         body1: {
//             fontFamily: 'Poppins, Arial, sans-serif',
//             fontSize: '0.9rem',
//             color: '#444444',
//             // color: '#333333',
//             fontWeight: 100,
//         },
//         h3: {
//           fontFamily: 'Poppins, Arial, sans-serif',
//           fontSize: '3rem',
//           fontWeight: 500,
//           color: '#333333'
//         },  
//         h4: {
//             fontFamily: 'Poppins, Arial, sans-serif',
//             fontSize: '1.5rem',
//             color: '#444444',
//             fontWeight: 500,
//         },
//         h5: {
//           fontFamily: 'Poppins, Arial, sans-serif',
//           fontSize: '1.3rem',
//           color: '#444444',
//           fontWeight: 300,
//         },
//         columnheader: {
//             fontFamily: 'Poppins, Arial, sans-serif',
//             fontSize: '2rem',
//             fontWeight: 800,
//         },
//     },
//     components: {
//         // Personalización global de componentes
//         MuiTableCell: {
//           styleOverrides: {
//             root: {
//                 textAlign: 'center', // Centra el contenido de las celdas
//                 fontFamily: 'inherit', // Hereda la fuente del tema
//             },
//           },
//         },
//         MuiSlider: {
//           styleOverrides: {
//             valueLabel: {
//               fontFamily: 'inherit', // Hereda la fuente del tema
//             },
//           },
//         },
//       },
// });

// export default theme;



// import { createTheme } from '@mui/material/styles';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark', // Esto activa el modo oscuro por defecto
//     primary: {
//       main: '#90caf9', // Azul claro para modo oscuro
//     },
//     secondary: {
//       main: '#f48fb1', // Rosa claro para modo oscuro
//     },
//     background: {
//       default: '#121212', // Fondo oscuro
//       paper: '#1e1e1e',   // Fondo de componentes como cards
//     },
//     text: {
//       primary: '#ffffff', // Texto principal blanco
//       secondary: 'rgba(255, 255, 255, 0.7)', // Texto secundario
//     },
//   },
//   typography: {
//     body1: {
//       fontFamily: 'Poppins, Arial, sans-serif',
//       fontSize: '0.9rem',
//       color: 'rgba(255, 255, 255, 0.9)', // Texto claro
//       fontWeight: 100,
//     },
//     h3: {
//       fontFamily: 'Poppins, Arial, sans-serif',
//       fontSize: '3rem',
//       fontWeight: 500,
//       color: '#ffffff' // Blanco para títulos
//     },  
//     h4: {
//       fontFamily: 'Poppins, Arial, sans-serif',
//       fontSize: '1.5rem',
//       color: 'rgba(255, 255, 255, 0.9)',
//       fontWeight: 500,
//     },
//     h5: {
//       fontFamily: 'Poppins, Arial, sans-serif',
//       fontSize: '1.3rem',
//       color: 'rgba(255, 255, 255, 0.8)',
//       fontWeight: 300,
//     },
//     columnheader: {
//       fontFamily: 'Poppins, Arial, sans-serif',
//       fontSize: '2rem',
//       fontWeight: 800,
//     },
//   },
//   components: {
//     MuiTableCell: {
//       styleOverrides: {
//         root: {
//           textAlign: 'center',
//           fontFamily: 'inherit',
//         },
//       },
//     },
//     MuiSlider: {
//       styleOverrides: {
//         valueLabel: {
//           fontFamily: 'inherit',
//         },
//       },
//     },
//   },
// });

// export default darkTheme;



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

