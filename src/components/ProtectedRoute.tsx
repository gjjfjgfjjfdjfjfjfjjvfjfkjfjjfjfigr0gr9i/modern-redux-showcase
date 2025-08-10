import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsAuthenticated,
  loadUserProfile,
} from '@/features/user/userSlice';
import { AppDispatch } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  useEffect(() => {
    // Если требуется авторизация и пользователь не авторизован,
    // но есть токен в localStorage, пытаемся загрузить профиль
    if (requireAuth && !isAuthenticated) {
      const token = localStorage.getItem('authToken');
      if (token) {
        dispatch(loadUserProfile()).unwrap();
      }
    }
  }, [dispatch, requireAuth, isAuthenticated]);

  // Если требуется авторизация и пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    // Перенаправляем на страницу входа, сохраняя текущий путь
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь авторизован и пытается зайти на страницу входа
  if (!requireAuth && isAuthenticated) {
    // Перенаправляем на главную страницу
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
