import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Layout from './Layout';
import cartReducer from '@/features/cart/cartSlice';
import userReducer from '@/features/user/userSlice';

// Создаем тестовый store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
    preloadedState: {
      cart: {
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
        isLoading: false,
        error: null,
        ...initialState.cart,
      },
      user: {
        data: null,
        isLoading: false,
        error: null,
        ...initialState.user,
      },
    },
  });
};

// Тестовый wrapper с провайдерами
const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}> = ({ children, initialState }) => {
  const store = createTestStore(initialState);

  return (
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('Layout Component', () => {
  test('renders header with title', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByText('Redux Showcase')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByText('Дашборд')).toBeInTheDocument();
    expect(screen.getByText('Продукты')).toBeInTheDocument();
    expect(screen.getByText(/Корзина/)).toBeInTheDocument();
    expect(screen.getByText('Заказы')).toBeInTheDocument();
    expect(screen.getByText('Пользователи')).toBeInTheDocument();
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
  });

  test('renders cart badge with correct count', () => {
    const initialState = {
      cart: {
        data: {
          items: [
            {
              id: '1',
              product: { id: '1', name: 'Test' },
              quantity: 3,
              price: 100,
              addedAt: '2024-01-01',
            },
          ],
          totalItems: 3,
          totalPrice: 300,
        },
      },
    };

    render(
      <TestWrapper initialState={initialState}>
        <Layout>
          <div>Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <TestWrapper>
        <Layout>
          <div data-testid="test-content">Test content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('does not show cart badge when cart is empty', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test content</div>
        </Layout>
      </TestWrapper>
    );

    const cartLink = screen.getByText(/Корзина/);
    expect(cartLink).toBeInTheDocument();

    // Проверяем, что бейдж не отображается
    const badge = cartLink.parentElement?.querySelector(
      '[class*="bg-primary-100"]'
    );
    expect(badge).not.toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test content</div>
        </Layout>
      </TestWrapper>
    );

    const dashboardLink = screen.getByText('Дашборд').closest('a');
    const productsLink = screen.getByText('Продукты').closest('a');
    const cartLink = screen.getByText(/Корзина/).closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });
});
