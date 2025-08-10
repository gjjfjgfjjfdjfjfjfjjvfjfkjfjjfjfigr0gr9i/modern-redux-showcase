import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  analytics: null,
  isLoading: false,
  error: null,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;
