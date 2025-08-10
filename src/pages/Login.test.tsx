import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/userSlice';
import Login from './Login';

// Мокаем react-router-dom
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/login',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Мокаем react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
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
  initialState: any = {}
) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает форму входа', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Вход в систему')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('отображает тестовых пользователей', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Администратор')).toBeInTheDocument();
    expect(screen.getByText('Менеджер')).toBeInTheDocument();
    expect(screen.getByText('Пользователь')).toBeInTheDocument();
  });

  it('заполняет форму при нажатии на кнопку "Заполнить"', () => {
    renderWithProviders(<Login />);

    const fillButtons = screen.getAllByText('Заполнить');
    fireEvent.click(fillButtons[0]); // Администратор

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement;

    expect(emailInput.value).toBe('admin@example.com');
    expect(passwordInput.value).toBe('admin123');
  });

  it('показывает индикатор загрузки во время входа', () => {
    renderWithProviders(<Login />, { isLoading: true });

    expect(screen.getByText('Вход...')).toBeInTheDocument();
  });

  it('отображает кнопки быстрого входа', () => {
    renderWithProviders(<Login />);

    const quickLoginButtons = screen.getAllByText('Быстрый вход');
    expect(quickLoginButtons).toHaveLength(3);
  });

  it('отображает кнопки заполнения формы', () => {
    renderWithProviders(<Login />);

    const fillButtons = screen.getAllByText('Заполнить');
    expect(fillButtons).toHaveLength(3);
  });
});
