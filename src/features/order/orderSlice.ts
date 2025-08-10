import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, AsyncListState } from '@/types';

// Начальное состояние
const initialState: AsyncListState<Order> = {
  data: [],
  isLoading: false,
  error: null,
};

// Создаем slice
export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Actions для Redux-Saga
    fetchOrdersRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createOrderRequest: (state, _action: PayloadAction<Partial<Order>>) => {
      state.isLoading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.data.push(action.payload);
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateOrderRequest: (
      state,
      _action: PayloadAction<{ id: string; order: Partial<Order> }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateOrderSuccess: (
      state,
      action: PayloadAction<{ id: string; order: Order }>
    ) => {
      state.isLoading = false;
      const index = state.data.findIndex(
        order => order.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = action.payload.order;
      }
    },
    updateOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteOrderRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteOrderSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.data = state.data.filter(order => order.id !== action.payload);
    },
    deleteOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearOrdersError: state => {
      state.error = null;
    },
  },
});

// Экспортируем actions
export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
  clearOrdersError,
} = orderSlice.actions;

// Селекторы
export const selectOrders = (state: { orders: AsyncListState<Order> }) =>
  state.orders.data;
export const selectOrdersLoading = (state: { orders: AsyncListState<Order> }) =>
  state.orders.isLoading;
export const selectOrdersError = (state: { orders: AsyncListState<Order> }) =>
  state.orders.error;

// Экспортируем reducer
export default orderSlice.reducer;
