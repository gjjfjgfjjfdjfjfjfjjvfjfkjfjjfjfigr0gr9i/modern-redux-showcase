import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, AsyncState, LoginForm, RegisterForm } from '@/types';

// Начальное состояние
const initialState: AsyncState<UserProfile> = {
  data: null,
  isLoading: false,
  error: null,
};

// Тестовые пользователи
const TEST_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Администратор',
    role: 'admin' as const,
    avatar: '👨‍💼',
  },
  {
    id: '2',
    email: 'manager@example.com',
    password: 'manager123',
    name: 'Менеджер',
    role: 'manager' as const,
    avatar: '👩‍💼',
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'user123',
    name: 'Пользователь',
    role: 'user' as const,
    avatar: '👤',
  },
];

// Async Thunk для аутентификации
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginForm, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Проверяем учетные данные среди тестовых пользователей
      const testUser = TEST_USERS.find(
        user =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (testUser) {
        const user: UserProfile = {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          avatar: testUser.avatar,
          preferences: {
            theme: 'light',
            language: 'ru',
            notifications: true,
          },
        };

        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', `demo-token-${testUser.id}`);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
      } else {
        throw new Error('Неверные учетные данные');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка входа'
      );
    }
  }
);

// Async Thunk для регистрации
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: RegisterForm, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Проверяем пароли
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      const user: UserProfile = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'user',
        preferences: {
          theme: 'light',
          language: 'ru',
          notifications: true,
        },
      };

      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

// Async Thunk для выхода
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 500));

      // Удаляем данные из localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

// Async Thunk для загрузки профиля
export const loadUserProfile = createAsyncThunk(
  'user/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 800));

      // Проверяем наличие токена
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      // Загружаем пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Данные пользователя не найдены');
      }

      return JSON.parse(userData) as UserProfile;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки профиля'
      );
    }
  }
);

// Async Thunk для обновления профиля
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<UserProfile>, { rejectWithValue, getState }) => {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Получаем текущее состояние
      const state = getState() as { user: AsyncState<UserProfile> };
      const currentUser = state.user.data;

      if (!currentUser) {
        throw new Error('Пользователь не найден');
      }

      // Обновляем профиль
      const updatedUser: UserProfile = {
        ...currentUser,
        ...updates,
      };

      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления профиля'
      );
    }
  }
);

// Создаем слайс
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Синхронные действия
    clearError: state => {
      state.error = null;
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      if (state.data) {
        state.data.preferences.theme = action.payload;
        localStorage.setItem('user', JSON.stringify(state.data));
      }
    },

    setLanguage: (state, action: PayloadAction<'ru' | 'en'>) => {
      if (state.data) {
        state.data.preferences.language = action.payload;
        localStorage.setItem('user', JSON.stringify(state.data));
      }
    },

    toggleNotifications: state => {
      if (state.data) {
        state.data.preferences.notifications =
          !state.data.preferences.notifications;
        localStorage.setItem('user', JSON.stringify(state.data));
      }
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.data = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load Profile
    builder
      .addCase(loadUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспортируем действия
export const { clearError, setTheme, setLanguage, toggleNotifications } =
  userSlice.actions;

// Селекторы
export const selectUser = (state: { user: AsyncState<UserProfile> }) =>
  state.user.data;
export const selectUserLoading = (state: { user: AsyncState<UserProfile> }) =>
  state.user.isLoading;
export const selectUserError = (state: { user: AsyncState<UserProfile> }) =>
  state.user.error;
export const selectIsAuthenticated = (state: {
  user: AsyncState<UserProfile>;
}) => !!state.user.data;
export const selectUserRole = (state: { user: AsyncState<UserProfile> }) =>
  state.user.data?.role;
export const selectUserPreferences = (state: {
  user: AsyncState<UserProfile>;
}) => state.user.data?.preferences;

export default userSlice.reducer;
