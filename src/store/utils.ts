import { RootState } from './rootReducer';
import { LoadingState, DataState, ListState, AppAction } from './types';

// Утилиты для работы с состояниями загрузки
export const createLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
  lastUpdated: undefined,
});

export const createDataState = <T>(): DataState<T> => ({
  isLoading: false,
  error: null,
  lastUpdated: undefined,
  data: null,
});

export const createListState = <T>(): ListState<T> => ({
  isLoading: false,
  error: null,
  lastUpdated: undefined,
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  hasMore: false,
});

// Утилиты для обновления состояний
export const setLoading = <T extends LoadingState>(
  state: T,
  isLoading: boolean
): T => ({
  ...state,
  isLoading,
  error: isLoading ? null : state.error,
});

export const setError = <T extends LoadingState>(
  state: T,
  error: string | null
): T => ({
  ...state,
  error,
  isLoading: false,
});

export const setData = <T, S extends DataState<T>>(state: S, data: T): S => ({
  ...state,
  data,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
});

export const setItems = <T, S extends ListState<T>>(
  state: S,
  items: T[],
  total: number,
  page: number = 1
): S => ({
  ...state,
  items: page === 1 ? items : [...state.items, ...items],
  total,
  page,
  hasMore: page * state.limit < total,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
});

// Утилиты для селекторов с правильной типизацией
export const selectIsLoading = (
  state: RootState,
  sliceName: keyof RootState
): boolean => {
  const slice = state[sliceName];
  // Проверяем, что slice существует и имеет свойство isLoading
  if (slice && typeof slice === 'object' && 'isLoading' in slice) {
    return (slice as LoadingState).isLoading;
  }
  return false;
};

export const selectError = (
  state: RootState,
  sliceName: keyof RootState
): string | null => {
  const slice = state[sliceName];
  // Проверяем, что slice существует и имеет свойство error
  if (slice && typeof slice === 'object' && 'error' in slice) {
    return (slice as LoadingState).error;
  }
  return null;
};

export const selectData = <T>(
  state: RootState,
  sliceName: keyof RootState
): T | null => {
  const slice = state[sliceName];
  // Проверяем, что slice существует и имеет свойство data
  if (slice && typeof slice === 'object' && 'data' in slice) {
    return (slice as DataState<T>).data;
  }
  return null;
};

export const selectItems = <T>(
  state: RootState,
  sliceName: keyof RootState
): T[] => {
  const slice = state[sliceName];
  // Проверяем, что slice существует и имеет свойство items
  if (slice && typeof slice === 'object' && 'items' in slice) {
    const listSlice = slice as unknown as ListState<T>;
    return listSlice.items;
  }
  return [];
};

// Утилиты для валидации состояний
export const isValidState = <T extends LoadingState>(state: T): boolean => {
  return !state.isLoading && !state.error;
};

export const isExpiredState = (
  state: LoadingState,
  ttl: number = 5 * 60 * 1000
): boolean => {
  if (!state.lastUpdated) return true;
  return Date.now() - state.lastUpdated > ttl;
};

// Утилиты для кэширования
export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.join(':');
};

export const getCacheKey = (
  actionType: string,
  params?: Record<string, unknown>
): string => {
  if (!params) return actionType;
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${actionType}?${sortedParams}`;
};

// Утилиты для логирования
export const logAction = (
  action: AppAction,
  state: RootState,
  sliceName?: keyof RootState
): void => {
  if (process.env.NODE_ENV === 'development') {
    // В development можно использовать console, но в production нужно proper logging
    // eslint-disable-next-line no-console
    console.group(`🔍 Redux Action: ${action.type}`);
    // eslint-disable-next-line no-console
    console.log('Action:', action);
    if (sliceName) {
      // eslint-disable-next-line no-console
      console.log(`${sliceName} State:`, state[sliceName]);
    }
    // eslint-disable-next-line no-console
    console.log('Full State:', state);
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};

// Утилиты для персистенции
export const serializeState = (state: RootState): string => {
  try {
    return JSON.stringify(state);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to serialize state:', error);
    return '{}';
  }
};

export const deserializeState = (serialized: string): Partial<RootState> => {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to deserialize state:', error);
    return {};
  }
};
