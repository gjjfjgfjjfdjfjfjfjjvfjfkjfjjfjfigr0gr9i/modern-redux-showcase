// Конфигурация Redux DevTools
export const devToolsConfig = {
  name: 'Redux Showcase',
  maxAge: 25, // Максимальное количество действий в истории
  logOnly: process.env.NODE_ENV === 'production', // Только логирование в продакшене
  features: {
    pause: true, // Пауза/воспроизведение
    lock: true, // Блокировка изменений
    persist: true, // Сохранение состояния
    export: true, // Экспорт состояния
    import: true, // Импорт состояния
    jump: true, // Переход к действию
    skip: true, // Пропуск действия
    reorder: true, // Изменение порядка
    dispatch: true, // Диспатч действий
    test: true, // Тестирование
  },
  actionsDenylist: [
    // Исключаем действия RTK Query из DevTools для чистоты
    'api/executeQuery/pending',
    'api/executeQuery/fulfilled',
    'api/executeQuery/rejected',
    'api/executeMutation/pending',
    'api/executeMutation/fulfilled',
    'api/executeMutation/rejected',
  ],
  stateTransformer: (state: unknown) => {
    // Трансформация состояния для DevTools
    const typedState = state as Record<string, unknown>;
    return {
      ...typedState,
      // Скрываем внутренние данные RTK Query
      api: {
        ...(typedState.api as Record<string, unknown>),
        queries: 'RTK Query Queries',
        mutations: 'RTK Query Mutations',
        subscriptions: 'RTK Query Subscriptions',
      },
    };
  },
};
