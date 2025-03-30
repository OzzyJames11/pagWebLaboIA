import React from 'react';
import { /*BrowserRouter as Router, */Route, Routes } from 'react-router-dom';
// import PrivateRoute from './PrivateRoute';

// Importa tus vistas (páginas)
import Home from '../pages/Home';
// import {Subsistema1, Subsistema2, Subsistema3, Subsistema4, DataSummary, ExperimentChooser} from '../pages/Experiments';

import { ROUTES } from '../assets/Strings/routes';
const AppRouter = () => {
    return (
        // <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                {/* <Route path={ROUTES.EXPERIMENTSCH} element={<ExperimentChooser />} />
                <Route path={ROUTES.SUBSISTEMA1} element={<Subsistema1 />} />
                <Route path={ROUTES.SUBSISTEMA2} element={<Subsistema2 />} />
                <Route path={ROUTES.SUBSISTEMA3} element={<Subsistema3 />} />
                <Route path={ROUTES.SUBSISTEMA4} element={<Subsistema4 />} />
                <Route path={ROUTES.DATA_SUMMARY} element={<DataSummary />} /> */}
            </Routes>

    );
};

export default AppRouter;