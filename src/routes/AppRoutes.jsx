import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RoleRoute from './RoleRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/child/Dashboard';
import Reto30Dias from '../pages/child/Reto30Dias';
import MisRetos from '../pages/child/MisRetos';
import PukaCards from '../pages/child/PukaCards';
import MiCultivo from '../pages/child/MiCultivo';
import SemillaPuka from '../pages/child/SemillaPuka';
import LigasPuka from '../pages/child/LigasPuka';
import Recompensas from '../pages/child/Recompensas';
import ImpactoSocial from '../pages/ImpactoSocial';
import DashboardPadre from '../pages/parent/DashboardPadre';
import DashboardAdmin from '../pages/admin/DashboardAdmin';

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-8 text-center">Cargando la magia de Puka Miski...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
      
      {/* Experiencia Pública/Privada Semilla Puka (Vía QR del empaque) */}
      <Route path="/semilla-puka" element={<SemillaPuka />} />
      
      {/* Sección Pública de Impacto Social y Donaciones */}
      <Route path="/impacto-social" element={<ImpactoSocial />} />
      
      {/* Rutas Privadas del Niño */}
      <Route element={<RoleRoute allowedRoles={['CHILD']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reto-30-dias" element={<Reto30Dias />} />
        <Route path="/mis-retos" element={<MisRetos />} />
        <Route path="/puka-cards" element={<PukaCards />} />
        <Route path="/mi-cultivo" element={<MiCultivo />} />
        <Route path="/ligas-puka" element={<LigasPuka />} />
        <Route path="/recompensas" element={<Recompensas />} />
      </Route>
      
      {/* Rutas Privadas del Padre */}
      <Route element={<RoleRoute allowedRoles={['PARENT', 'ADMIN']} />}>
        <Route path="/padre" element={<DashboardPadre />} />
      </Route>
      
      {/* Rutas Privadas de Admin */}
      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<DashboardAdmin />} />
      </Route>

      {/* Redirección por defecto dependiendo del login */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'CHILD' ? '/dashboard' : (user.role === 'PARENT' ? '/padre' : '/admin')) : '/login'} />} />
    </Routes>
  );
}
