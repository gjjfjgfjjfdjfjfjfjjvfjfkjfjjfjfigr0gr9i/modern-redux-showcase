import createSagaMiddleware from 'redux-saga';
import { apiMiddleware } from '@/api/baseApi';

// Создаем saga middleware
export const sagaMiddleware = createSagaMiddleware();

// Конфигурация middleware для store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStoreMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Игнорируем определенные типы действий для saga и RTK Query
      ignoredActions: [
        'persist/PERSIST',
        'persist/REHYDRATE',
        'api/executeQuery/pending',
        'api/executeQuery/fulfilled',
        'api/executeQuery/rejected',
        'api/executeMutation/pending',
        'api/executeMutation/fulfilled',
        'api/executeMutation/rejected',
      ],
      ignoredActionPaths: [
        'payload.timestamp',
        'payload.requestId',
        'payload.startTime',
        'payload.endTime',
      ],
      ignoredPaths: [
        'api.queries',
        'api.mutations',
        'api.subscriptions',
        'api.provided',
        'api.config',
      ],
    },
    thunk: true, // Включаем Redux Thunk (встроен в RTK)
  }).concat(sagaMiddleware, apiMiddleware);

// Типы для middleware
export type AppMiddleware = ReturnType<typeof createStoreMiddleware>;
