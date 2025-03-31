// import React from 'react';
// import { Button, Divider } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { Home, LocalHospital, Person, AdminPanelSettings } from '@mui/icons-material';
// import styles from '../../assets/css/headerLinks.module.css';
// import { useAuth } from '../../context/AuthContext'; // se importa el hook de autenticación

// const HeaderLinks = ({ divider, closeDrawer }) => {
//     const { user, isAuthenticated, logout } = useAuth();

//     return (
//         <>
//             {/* Enlace a Inicio, siempre visible */}
//             <Link onClick={closeDrawer} to="/" className={styles.navLink}>
//                 <Button className={styles.button}>
//                     <Home className={styles.icons} />
//                     <span className={styles.items}>Inicio</span>
//                 </Button>
//             </Link>
//             {divider && <Divider className={styles.divider} />}

//             {/* Enlaces para usuarios autenticados */}
//             {isAuthenticated && (
//                 <>
//                 {/* Enlace a Datos (visible para todos los roles) */}
//                 <Link onClick={closeDrawer} to="/datos" className={styles.navLink}>
//                     <Button className={styles.button}>
//                         <Person className={styles.icons} />
//                         <span className={styles.items}>Datos</span>
//                     </Button>
//                 </Link>
//                 {divider && <Divider className={styles.divider} />}

//                 {/* Enlace a Administración (solo para admin) */}
//                 {user?.rol === 'admin' && (
//                     <>
//                     <Link onClick={closeDrawer} to="/admin" className={styles.navLink}>
//                         <Button className={styles.button}>
//                             <AdminPanelSettings className={styles.icons} />
//                             <span className={styles.items}>Administración</span>
//                         </Button>
//                     </Link>
//                         {divider && <Divider className={styles.divider} />}
//                     </>
//                 )}

//                 {/* Botón de Cerrar Sesión */}
//                 <Button 
//                     onClick={() => {
//                     logout();
//                     if (closeDrawer) closeDrawer();
//                     }} 
//                     className={styles.button}
//                 >
//                     <span className={styles.items}>Cerrar Sesión</span>
//                 </Button>
//                 {divider && <Divider className={styles.divider} />}
//                 </>
//             )}

//             {/* Enlace a Registro/Login (solo para no autenticados) */}
//             {!isAuthenticated && (
//                 <Link onClick={closeDrawer} to="/registro" className={styles.navLink}>
//                 <Button className={styles.button}>
//                     <LocalHospital className={styles.icons} />
//                     <span className={styles.items}>Regístrate</span>
//                 </Button>
//                 </Link>
//             )}
//             {divider && <Divider className={styles.divider} />}
//         </>
//     );
// };

// export default HeaderLinks;

import React from 'react';
import { Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, Person, AdminPanelSettings, ExitToApp } from '@mui/icons-material';
import styles from '../../assets/css/headerLinks.module.css';
import { useAuth } from '../../context/AuthContext';

const HeaderLinks = ({ divider, closeDrawer }) => {
  const { user, isAuthenticated, logout } = useAuth();
  console.log('HeaderLinks - auth state:', { isAuthenticated, user }); // Debug añadido

  return (
    <>
      {/* Enlace a Inicio (siempre visible) */}
      <Link onClick={closeDrawer} to="/" className={styles.navLink}>
        <Button className={styles.button}>
          <Home className={styles.icons} />
          <span className={styles.items}>Inicio</span>
        </Button>
      </Link>
      {divider && <Divider className={styles.divider} />}

      {/* Enlaces para usuarios autenticados */}
      {isAuthenticated && (
        <>
          {/* Enlace a Datos (visible para todos los roles) */}
          <Link onClick={closeDrawer} to="/datos" className={styles.navLink}>
            <Button className={styles.button}>
              <Person className={styles.icons} />
              <span className={styles.items}>Mis Datos</span>
            </Button>
          </Link>
          {divider && <Divider className={styles.divider} />}

          {/* Enlace a Administración (solo para administrador) */}
          {user?.rol === 'administrador' && (
            <>
              <Link onClick={closeDrawer} to="/admin" className={styles.navLink}>
                <Button className={styles.button}>
                  <AdminPanelSettings className={styles.icons} />
                  <span className={styles.items}>Administración</span>
                </Button>
              </Link>
              {divider && <Divider className={styles.divider} />}
            </>
          )}

          {/* Botón de Cerrar Sesión */}
          <Button 
            onClick={() => {
              logout();
              if (closeDrawer) closeDrawer();
            }} 
            className={styles.button}
            startIcon={<ExitToApp />}
          >
            <span className={styles.items}>Cerrar Sesión</span>
          </Button>
          {divider && <Divider className={styles.divider} />}
        </>
      )}

      {/* Enlace a Registro/Login (solo para no autenticados) */}
      {!isAuthenticated && (
        <Link onClick={closeDrawer} to="/registro" className={styles.navLink}>
          <Button className={styles.button}>
            <Person className={styles.icons} />
            <span className={styles.items}>Regístrate / Inicia Sesión</span>
          </Button>
        </Link>
      )}
      {divider && <Divider className={styles.divider} />}
    </>
  );
};

export default HeaderLinks;