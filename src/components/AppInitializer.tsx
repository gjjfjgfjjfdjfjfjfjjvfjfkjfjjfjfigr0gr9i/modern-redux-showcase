import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserProfile, selectUserLoading } from '@/features/user/userSlice';
import { AppDispatch } from '@/store';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectUserLoading);

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Загружаем профиль пользователя
      dispatch(loadUserProfile()).unwrap();
    }
  }, [dispatch]);

  // Показываем индикатор загрузки только при инициализации
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
