import { configureStore } from '@reduxjs/toolkit';
import { createStoreMiddleware, sagaMiddleware } from './middleware';
import { rootSaga } from './sagas';
import { rootReducer } from './rootReducer';
import { devToolsConfig } from './devTools';
import type { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

// Конфигурируем store с поддержкой всех middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: createStoreMiddleware,
  devTools: process.env.NODE_ENV !== 'production' ? devToolsConfig : false,
  preloadedState: {
    // Начальное состояние для гидратации
    user: {
      data: null,
      isLoading: false,
      error: null,
    },
    cart: {
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
      isLoading: false,
      error: null,
    },
    notifications: {
      notifications: [],
      isLoading: false,
      error: null,
    },
  },
});

// Запускаем root saga
sagaMiddleware.run(rootSaga);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Экспортируем store для использования в других частях приложения
export default store;
