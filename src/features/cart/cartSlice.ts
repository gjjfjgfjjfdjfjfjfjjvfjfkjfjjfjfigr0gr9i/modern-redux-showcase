import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem, Product } from '@/types';

// Начальное состояние
const initialState = {
  data: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  } as Cart,
  isLoading: false,
  error: null as string | null,
};

// Async Thunk для загрузки корзины
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 800));

      // Загружаем корзину из localStorage
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        return JSON.parse(cartData) as Cart;
      }

      return initialState.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки корзины'
      );
    }
  }
);

// Async Thunk для сохранения корзины
export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (cart: Cart, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 500));

      // Сохраняем корзину в localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      return cart;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сохранения корзины'
      );
    }
  }
);

// Async Thunk для очистки корзины
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 300));

      // Удаляем корзину из localStorage
      localStorage.removeItem('cart');

      return initialState.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка очистки корзины'
      );
    }
  }
);

// Функция для вычисления общей суммы корзины
const calculateCartTotals = (
  items: CartItem[]
): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// Создаем слайс
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Синхронные действия
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;

      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = state.data.items.findIndex(
        item => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Увеличиваем количество существующего товара
        state.data.items[existingItemIndex].quantity += quantity;
        state.data.items[existingItemIndex].price = product.price;
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          price: product.price,
          addedAt: new Date().toISOString(),
        };
        state.data.items.push(newItem);
      }

      // Пересчитываем общие суммы
      const totals = calculateCartTotals(state.data.items);
      state.data.totalItems = totals.totalItems;
      state.data.totalPrice = totals.totalPrice;

      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(state.data));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.data.items = state.data.items.filter(item => item.id !== itemId);

      // Пересчитываем общие суммы
      const totals = calculateCartTotals(state.data.items);
      state.data.totalItems = totals.totalItems;
      state.data.totalPrice = totals.totalPrice;

      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(state.data));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.data.items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Удаляем товар если количество 0 или меньше
          state.data.items.splice(itemIndex, 1);
        } else {
          // Обновляем количество
          state.data.items[itemIndex].quantity = quantity;
        }

        // Пересчитываем общие суммы
        const totals = calculateCartTotals(state.data.items);
        state.data.totalItems = totals.totalItems;
        state.data.totalPrice = totals.totalPrice;

        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(state.data));
      }
    },

    applyDiscount: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      const { code, discount } = action.payload;
      state.data.discountCode = code;
      state.data.discount = discount;

      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(state.data));
    },

    removeDiscount: state => {
      state.data.discountCode = undefined;
      state.data.discount = undefined;

      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(state.data));
    },

    clearError: state => {
      state.error = null;
    },

    // Синхронный action для очистки корзины (для тестов)
    clearCartSync: state => {
      state.data = initialState.data;
      localStorage.removeItem('cart');
    },
  },
  extraReducers: builder => {
    // Load Cart
    builder
      .addCase(loadCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
      });

    // Save Cart
    builder
      .addCase(saveCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, state => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспортируем действия
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  removeDiscount,
  clearError,
  clearCartSync,
} = cartSlice.actions;

// Селекторы
export const selectCart = (state: { cart: typeof initialState }) =>
  state.cart.data;
export const selectCartItems = (state: { cart: typeof initialState }) =>
  state.cart.data?.items || [];
export const selectCartTotalItems = (state: { cart: typeof initialState }) =>
  state.cart.data?.totalItems || 0;
export const selectCartTotalPrice = (state: { cart: typeof initialState }) =>
  state.cart.data?.totalPrice || 0;
export const selectCartDiscount = (state: { cart: typeof initialState }) =>
  state.cart.data?.discount || 0;
export const selectCartDiscountCode = (state: { cart: typeof initialState }) =>
  state.cart.data?.discountCode || '';
export const selectCartLoading = (state: { cart: typeof initialState }) =>
  state.cart.isLoading;
export const selectCartError = (state: { cart: typeof initialState }) =>
  state.cart.error;
export const selectIsCartEmpty = (state: { cart: typeof initialState }) =>
  (state.cart.data?.items || []).length === 0;

// Вычисляемые селекторы
export const selectCartFinalPrice = (state: { cart: typeof initialState }) => {
  const { totalPrice = 0, discount = 0 } = state.cart.data || {};
  return totalPrice - discount;
};

export const selectCartItemById =
  (itemId: string) => (state: { cart: typeof initialState }) => {
    return (state.cart.data?.items || []).find(item => item.id === itemId);
  };

export default cartSlice.reducer;
