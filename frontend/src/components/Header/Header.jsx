import React, { useState } from 'react';
import { AppBar, Toolbar, Container, Box, Drawer, useScrollTrigger } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dehaze } from '@mui/icons-material';
// import headerLogo from '../../assets/img/header_logo.png';
import epnLogo from '../../assets/img/logo-epn-white.png';
import laboIALogo from '../../assets/img/iconoLaboIA_R2.png';
import HeaderLinks from './Header.links'; // Importa el componente de enlaces
import styles from '../../assets/css/header.module.css'; // Importa los estilos del Header

const Header = (props) => {
    const [open, setOpen] = useState(false);
    const { absolute, fixed, transparent } = props;

    // Lógica para el efecto de scroll
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
    });

    // Clases dinámicas
    const appBarClasses = [
        styles.appBar,
        transparent && !trigger ? styles.transparent : '',
        absolute ? styles.absolute : '',
        fixed ? styles.fixed : '',
    ].join(' ').trim();

    return (
        <AppBar className={appBarClasses}>
            <Toolbar>
                <Container className={styles.container}>
                    <Box display="flex" alignItems="center">
                        <img src={epnLogo} alt="Logotipo EPN" style={{ height: '50px', maxWidth: '75px' }} />
                        <Box 
                            borderRight={1} 
                            borderColor="grey.400" 
                            height="40px" 
                            mx={2}  // Margen horizontal
                        />
                        {/* <Link to="/" style={{ textDecoration: 'none' }}> */}
                            <img src={laboIALogo} alt="Logotipo_laboIA" style={{ width: '70%', maxWidth: '500px', minWidth: '45px', maxHeight: '50px' }} />
                        {/* </Link> */}
                    </Box>
                    {/* Enlaces (versión escritorio) */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <HeaderLinks />
                    </Box>

                    {/* Menú móvil */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Dehaze onClick={() => setOpen(true)} />
                        <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
                            <Box bgcolor="#001f3e" height="100%" width="225px" display="flex" flexDirection="column">
                                <HeaderLinks divider closeDrawer={() => setOpen(false)} />
                            </Box>
                        </Drawer>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;