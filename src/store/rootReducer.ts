import { combineReducers } from '@reduxjs/toolkit';
import { apiReducer, apiReducerPath } from '@/api/baseApi';

// Импортируем все reducers (пока пустые, добавим позже)
import { userSlice } from '@/features/user/userSlice';
import usersReducer from '@/features/user/usersSlice';
import { cartSlice } from '@/features/cart/cartSlice';
import { notificationSlice } from '@/features/notification/notificationSlice';
import { productSlice } from '@/features/product/productSlice';
import { orderSlice } from '@/features/order/orderSlice';
import { analyticsSlice } from '@/features/analytics/analyticsSlice';

// Объединяем все reducers
export const rootReducer = combineReducers({
  // RTK Query API
  [apiReducerPath]: apiReducer,

  // Redux Toolkit Slices
  user: userSlice.reducer,
  users: usersReducer,
  cart: cartSlice.reducer,
  notifications: notificationSlice.reducer,
  products: productSlice.reducer,
  orders: orderSlice.reducer,
  analytics: analyticsSlice.reducer,
});

// Тип корневого состояния
export type RootState = ReturnType<typeof rootReducer>;
