import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCartSync,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from './cartSlice';
import type { Product } from '@/types';

// Создаем тестовый store
const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  });
};

// Тестовые данные
const mockProduct: Product = {
  id: '1',
  name: 'Тестовый продукт',
  description: 'Описание тестового продукта',
  price: 1000,
  category: 'electronics',
  image: 'test-image.jpg',
  stock: 10,
  rating: 4.5,
  reviews: 50,
  tags: ['test'],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('Cart Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Actions', () => {
    test('should add item to cart', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(1);
      expect(state.data.items[0].product.id).toBe('1');
      expect(state.data.items[0].quantity).toBe(2);
      expect(state.data.totalItems).toBe(2);
      expect(state.data.totalPrice).toBe(2000);
    });

    test('should update quantity if item already exists', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
      store.dispatch(addToCart({ product: mockProduct, quantity: 3 }));

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(1);
      expect(state.data.items[0].quantity).toBe(4);
      expect(state.data.totalItems).toBe(4);
      expect(state.data.totalPrice).toBe(4000);
    });

    test('should remove item from cart', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
      const state = store.getState().cart;
      const itemId = state.data.items[0].id;
      store.dispatch(removeFromCart(itemId));

      const updatedState = store.getState().cart;
      expect(updatedState.data.items).toHaveLength(0);
      expect(updatedState.data.totalItems).toBe(0);
      expect(updatedState.data.totalPrice).toBe(0);
    });

    test('should update item quantity', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
      const state = store.getState().cart;
      const itemId = state.data.items[0].id;
      store.dispatch(updateQuantity({ itemId, quantity: 5 }));

      const updatedState = store.getState().cart;
      expect(updatedState.data.items[0].quantity).toBe(5);
      expect(updatedState.data.totalItems).toBe(5);
      expect(updatedState.data.totalPrice).toBe(5000);
    });

    test('should remove item when quantity is 0', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
      const state = store.getState().cart;
      const itemId = state.data.items[0].id;
      store.dispatch(updateQuantity({ itemId, quantity: 0 }));

      const updatedState = store.getState().cart;
      expect(updatedState.data.items).toHaveLength(0);
      expect(updatedState.data.totalItems).toBe(0);
      expect(updatedState.data.totalPrice).toBe(0);
    });

    test('should clear cart', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
      store.dispatch(clearCartSync());

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(0);
      expect(state.data.totalItems).toBe(0);
      expect(state.data.totalPrice).toBe(0);
    });
  });

  describe('Selectors', () => {
    test('should select cart items', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));

      const items = selectCartItems(store.getState());
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('1');
    });

    test('should select total items', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 3 }));

      const totalItems = selectCartTotalItems(store.getState());
      expect(totalItems).toBe(3);
    });

    test('should select total price', () => {
      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));

      const totalPrice = selectCartTotalPrice(store.getState());
      expect(totalPrice).toBe(2000);
    });
  });

  describe('Edge cases', () => {
    test('should handle multiple products', () => {
      const product2: Product = {
        ...mockProduct,
        id: '2',
        name: 'Продукт 2',
        price: 500,
      };

      store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
      store.dispatch(addToCart({ product: product2, quantity: 1 }));

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(2);
      expect(state.data.totalItems).toBe(3);
      expect(state.data.totalPrice).toBe(2500);
    });

    test('should handle removing non-existent item', () => {
      store.dispatch(removeFromCart('non-existent'));

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(0);
    });

    test('should handle updating non-existent item', () => {
      store.dispatch(updateQuantity({ itemId: 'non-existent', quantity: 5 }));

      const state = store.getState().cart;
      expect(state.data.items).toHaveLength(0);
    });
  });
});
