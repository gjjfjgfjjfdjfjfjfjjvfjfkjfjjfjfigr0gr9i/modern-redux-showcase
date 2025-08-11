import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/userSlice';
import ProtectedRoute from './ProtectedRoute';

// Мокаем react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Navigate: ({ to, state }: { to: string; state?: any }) => {
    mockNavigate(to, state);
    return (
      <div
        data-testid="navigate"
        data-to={to}
        data-state={JSON.stringify(state)}
      />
    );
  },
  useLocation: () => ({
    pathname: '/protected',
    search: '',
    hash: '',
    state: null,
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        data: null,
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any = {},
  initialEntries = ['/protected']
) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={initialEntries}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  it('отображает дочерний компонент для авторизованного пользователя', () => {
    const { getByText } = renderWithProviders(
      <ProtectedRoute>
        <div>Защищенный контент</div>
      </ProtectedRoute>,
      {
        data: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      }
    );

    expect(getByText('Защищенный контент')).toBeInTheDocument();
  });

  it('перенаправляет на страницу входа для неавторизованного пользователя', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Защищенный контент</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.any(Object));
  });

  it('отображает страницу входа для неавторизованного пользователя', () => {
    const { getByText } = renderWithProviders(
      <ProtectedRoute requireAuth={false}>
        <div>Страница входа</div>
      </ProtectedRoute>,
      {},
      ['/login']
    );

    expect(getByText('Страница входа')).toBeInTheDocument();
  });
});
