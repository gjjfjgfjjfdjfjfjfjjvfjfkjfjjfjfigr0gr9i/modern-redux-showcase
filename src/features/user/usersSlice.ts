import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, AsyncListState } from '@/types';

// Начальное состояние для списка пользователей
const initialState: AsyncListState<User> = {
  data: [],
  isLoading: false,
  error: null,
};

// Async Thunk для загрузки пользователей
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей');
      }
      const users = await response.json();
      return users;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки пользователей'
      );
    }
  }
);

// Async Thunk для создания пользователя
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка создания пользователя');
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка создания пользователя'
      );
    }
  }
);

// Async Thunk для обновления пользователя
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (
    { id, user }: { id: string; user: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка обновления пользователя');
      }

      const updatedUser = await response.json();
      return { id, user: updatedUser };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка обновления пользователя'
      );
    }
  }
);

// Async Thunk для удаления пользователя
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка удаления пользователя');
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка удаления пользователя'
      );
    }
  }
);

// Создаем slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // createUser
    builder
      .addCase(createUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.data.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateUser
    builder
      .addCase(updateUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<{ id: string; user: User }>) => {
          state.isLoading = false;
          const index = state.data.findIndex(
            user => user.id === action.payload.id
          );
          if (index !== -1) {
            state.data[index] = action.payload.user;
          }
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // deleteUser
    builder
      .addCase(deleteUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.data = state.data.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспортируем actions
export const { clearUsersError } = usersSlice.actions;

// Селекторы
export const selectUsers = (state: { users: AsyncListState<User> }) =>
  state.users.data;
export const selectUsersLoading = (state: { users: AsyncListState<User> }) =>
  state.users.isLoading;
export const selectUsersError = (state: { users: AsyncListState<User> }) =>
  state.users.error;

// Экспортируем reducer
export default usersSlice.reducer;
