import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Cargando la magia...</div>;
  }

  // Si no hay usuario logueado, a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está en la lista de permitidos
  if (!allowedRoles.includes(user.role)) {
    // Redirigir a su área por defecto dependiendo del rol
    if (user.role === 'CHILD') return <Navigate to="/dashboard" replace />;
    if (user.role === 'PARENT') return <Navigate to="/padre" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    
    return <Navigate to="/login" replace />; // fallback
  }

  // Si tiene permiso, renderiza los hijos de la ruta (Outlet)
  return <Outlet />;
}
