import { Action, AnyAction, Store, Dispatch } from '@reduxjs/toolkit';

// Базовый тип для Redux actions
export interface AppAction<P = unknown> extends Action<string> {
  payload?: P;
  meta?: {
    timestamp?: number;
    requestId?: string;
    [key: string]: unknown;
  };
  error?: {
    message: string;
    code?: string;
    [key: string]: unknown;
  };
}

// Тип для async actions
export interface AsyncAction<P = unknown> extends AppAction<P> {
  meta?: {
    timestamp?: number;
    requestId?: string;
    async?: boolean;
    [key: string]: unknown;
  };
}

// Тип для состояний загрузки
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: number;
}

// Тип для состояний с данными
export interface DataState<T> extends LoadingState {
  data: T | null;
}

// Тип для состояний со списками
export interface ListState<T> extends LoadingState {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Тип для состояний с фильтрами
export interface FilterState {
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Тип для состояний с пагинацией
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Тип для состояний с поиском
export interface SearchState<T = unknown> {
  query: string;
  results: T[];
  isSearching: boolean;
}

// Тип для состояний с кэшированием
export interface CacheState<T> {
  data: T | null;
  timestamp: number;
  ttl: number; // Time to live в миллисекукундах
  isValid: boolean;
}

// Утилиты для создания actions
export const createAction = <P = void>(
  type: string,
  payload?: P
): AppAction<P> => ({
  type,
  payload,
  meta: {
    timestamp: Date.now(),
  },
});

export const createAsyncAction = <P = void>(
  type: string,
  payload?: P,
  requestId?: string
): AsyncAction<P> => ({
  type,
  payload,
  meta: {
    timestamp: Date.now(),
    requestId,
    async: true,
  },
});

export const createErrorAction = <P = void>(
  type: string,
  error: string,
  payload?: P
): AppAction<P> => ({
  type,
  payload,
  error: {
    message: error,
  },
  meta: {
    timestamp: Date.now(),
  },
});

// Типы для middleware
export type MiddlewareFunction = (
  store: Store
) => (next: Dispatch) => (action: AnyAction) => unknown;

// Типы для enhancers
export type StoreEnhancer = (createStore: unknown) => unknown;
