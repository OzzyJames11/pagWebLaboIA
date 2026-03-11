import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import DatosPasante from '../pages/Datos/DatosPasante';
import Administracion from '../pages/Administracion/Administracion';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />
      
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