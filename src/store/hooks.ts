import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Типы для слайсов с isLoading и error
type SliceWithLoading = {
  isLoading: boolean;
  error: string | null;
};

// Селекторы для часто используемых частей состояния
export const useUser = () => useAppSelector(state => state.user);
export const useCart = () => useAppSelector(state => state.cart);
export const useNotifications = () =>
  useAppSelector(state => state.notifications);
export const useProducts = () => useAppSelector(state => state.products);
export const useOrders = () => useAppSelector(state => state.orders);
export const useAnalytics = () => useAppSelector(state => state.analytics);

// Селекторы для API состояния
export const useApiState = () => useAppSelector(state => state.api);

// Утилиты для работы с состоянием
export const useIsLoading = (sliceName: keyof RootState) => {
  return useAppSelector(state => {
    const slice = state[sliceName];
    // Проверяем, есть ли свойство isLoading в слайсе
    if (slice && typeof slice === 'object' && 'isLoading' in slice) {
      return (slice as SliceWithLoading).isLoading || false;
    }
    return false;
  });
};

export const useError = (sliceName: keyof RootState) => {
  return useAppSelector(state => {
    const slice = state[sliceName];
    // Проверяем, есть ли свойство error в слайсе
    if (slice && typeof slice === 'object' && 'error' in slice) {
      return (slice as SliceWithLoading).error || null;
    }
    return null;
  });
};
