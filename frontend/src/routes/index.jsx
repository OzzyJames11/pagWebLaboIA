// import React from 'react';
// import { /*BrowserRouter as Router, */Route, Routes } from 'react-router-dom';
// // import PrivateRoute from './PrivateRoute';

// // Importa tus vistas (páginas)
// import Home from '../pages/Home';
// // import {Subsistema1, Subsistema2, Subsistema3, Subsistema4, DataSummary, ExperimentChooser} from '../pages/Experiments';

// import { ROUTES } from '../assets/Strings/routes';
// const AppRouter = () => {
//     return (
//         // <Router>
//             <Routes>
//                 {/* Rutas públicas */}
//                 <Route path="/" element={<Home />} />
//                 {/* <Route path={ROUTES.EXPERIMENTSCH} element={<ExperimentChooser />} />
//                 <Route path={ROUTES.SUBSISTEMA1} element={<Subsistema1 />} />
//                 <Route path={ROUTES.SUBSISTEMA2} element={<Subsistema2 />} />
//                 <Route path={ROUTES.SUBSISTEMA3} element={<Subsistema3 />} />
//                 <Route path={ROUTES.SUBSISTEMA4} element={<Subsistema4 />} />
//                 <Route path={ROUTES.DATA_SUMMARY} element={<DataSummary />} /> */}
//             </Routes>

//     );
// };

// export default AppRouter;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import DatosPasante from '../pages/Datos/DatosPasante';
import Administracion from '../pages/Administracion/Administracion';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route element={<ProtectedRoute allowedRoles={['pasante', 'administrador', 'superadmin']} />}>
        <Route path="/datos" element={<DatosPasante />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['administrador','superadmin']} />}>
        <Route path="/admin" element={<Administracion />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;