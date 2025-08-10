import { call, put, takeLatest, delay, select, all } from 'redux-saga/effects';
import { toast } from 'react-hot-toast';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import {
  loginUser,
  registerUser,
  logoutUser,
  loadUserProfile,
  updateUserProfile,
} from './userSlice';
import type { LoginForm, RegisterForm, UserProfile } from '@/types';

// Селектор для получения текущего пользователя
const selectCurrentUser = (state: RootState): UserProfile | null =>
  state.user.data;

// Тестовые пользователи (должны соответствовать тем, что в Login.tsx)
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

// Функция для имитации API запроса
const apiRequest = async (_endpoint: string, data?: unknown) => {
  // Имитируем задержку сети
  await new Promise(resolve =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  // Имитируем ошибки сети (5% случаев)
  if (Math.random() < 0.05) {
    throw new Error('Ошибка сети');
  }

  return { success: true, data };
};

// Saga для входа пользователя
function* loginUserSaga(
  action: PayloadAction<LoginForm>
): Generator<unknown, void, unknown> {
  try {
    // Проверяем, что payload существует и содержит необходимые данные
    if (!action.payload || !action.payload.email || !action.payload.password) {
      // Если данные отсутствуют, не обрабатываем в saga
      // Пусть async thunk обработает это
      return;
    }

    const { email, password } = action.payload;

    // Показываем уведомление о начале процесса
    toast.loading('Вход в систему...', { id: 'login' });

    // Имитируем API запрос
    yield call(apiRequest, '/auth/login', { email, password });

    // Проверяем учетные данные среди тестовых пользователей
    const testUser = TEST_USERS.find(
      user => user.email === email && user.password === password
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

      // Имитируем дополнительную задержку для обработки
      yield delay(500);

      // Успешный результат
      yield put(loginUser.fulfilled(user, '', action.payload));

      toast.success('Успешный вход в систему!', { id: 'login' });
    } else {
      throw new Error('Неверные учетные данные');
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка входа';

    // Неуспешный результат
    yield put(
      loginUser.rejected(error as Error, '', action.payload, errorMessage)
    );

    toast.error(errorMessage, { id: 'login' });
  }
}

// Saga для регистрации пользователя
function* registerUserSaga(
  action: PayloadAction<RegisterForm>
): Generator<unknown, void, unknown> {
  try {
    // Проверяем, что payload существует и содержит необходимые данные
    if (
      !action.payload ||
      !action.payload.email ||
      !action.payload.password ||
      !action.payload.name
    ) {
      // Если данные отсутствуют, не обрабатываем в saga
      // Пусть async thunk обработает это
      return;
    }

    const { name, email, password, confirmPassword } = action.payload;

    // Показываем уведомление о начале процесса
    toast.loading('Регистрация...', { id: 'register' });

    // Валидация
    if (password !== confirmPassword) {
      throw new Error('Пароли не совпадают');
    }

    if (password.length < 6) {
      throw new Error('Пароль должен содержать минимум 6 символов');
    }

    // Имитируем API запрос
    yield call(apiRequest, '/auth/register', { name, email, password });

    // Создаем пользователя
    const user: UserProfile = {
      id: Date.now().toString(),
      email,
      name,
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

    // Имитируем дополнительную задержку
    yield delay(800);

    // Успешный результат
    yield put(registerUser.fulfilled(user, '', action.payload));

    toast.success('Регистрация успешна!', { id: 'register' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка регистрации';

    // Неуспешный результат
    yield put(
      registerUser.rejected(error as Error, '', action.payload, errorMessage)
    );

    toast.error(errorMessage, { id: 'register' });
  }
}

// Saga для выхода пользователя
function* logoutUserSaga(): Generator<unknown, void, unknown> {
  try {
    // Получаем текущего пользователя
    const currentUser = (yield select(selectCurrentUser)) as UserProfile | null;

    if (currentUser) {
      // Показываем уведомление
      toast.loading('Выход из системы...', { id: 'logout' });

      // Имитируем API запрос для выхода
      yield call(apiRequest, '/auth/logout');

      // Удаляем данные из localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Имитируем задержку
      yield delay(300);

      // Успешный результат
      yield put(logoutUser.fulfilled(null, '', undefined));

      toast.success('Вы вышли из системы', { id: 'logout' });
    } else {
      // Если пользователь не авторизован, просто очищаем состояние
      yield put(logoutUser.fulfilled(null, '', undefined));
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка выхода';

    // Неуспешный результат
    yield put(logoutUser.rejected(error as Error, '', undefined, errorMessage));

    toast.error(errorMessage, { id: 'logout' });
  }
}

// Saga для загрузки профиля пользователя
function* loadUserProfileSaga(): Generator<unknown, void, unknown> {
  try {
    // Показываем уведомление
    toast.loading('Загрузка профиля...', { id: 'loadProfile' });

    // Проверяем наличие токена
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Токен не найден');
    }

    // Имитируем API запрос
    yield call(apiRequest, '/auth/profile');

    // Загружаем пользователя из localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('Данные пользователя не найдены');
    }

    const user = JSON.parse(userData) as UserProfile;

    // Имитируем задержку
    yield delay(500);

    // Успешный результат
    yield put(loadUserProfile.fulfilled(user, '', undefined));

    toast.success('Профиль загружен', { id: 'loadProfile' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки профиля';

    // Неуспешный результат
    yield put(
      loadUserProfile.rejected(error as Error, '', undefined, errorMessage)
    );

    toast.error(errorMessage, { id: 'loadProfile' });
  }
}

// Saga для обновления профиля пользователя
function* updateUserProfileSaga(
  action: PayloadAction<Partial<UserProfile>>
): Generator<unknown, void, unknown> {
  try {
    // Проверяем, что payload существует
    if (!action.payload) {
      // Если данные отсутствуют, не обрабатываем в saga
      // Пусть async thunk обработает это
      return;
    }

    const updates = action.payload;

    // Показываем уведомление
    toast.loading('Обновление профиля...', { id: 'updateProfile' });

    // Получаем текущего пользователя
    const currentUser = (yield select(selectCurrentUser)) as UserProfile | null;

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    // Имитируем API запрос
    yield call(apiRequest, '/auth/profile', updates);

    // Обновляем профиль
    const updatedUser: UserProfile = {
      ...currentUser,
      ...updates,
      id: updates.id || currentUser.id,
      email: updates.email || currentUser.email,
      name: updates.name || currentUser.name,
      role: updates.role || currentUser.role,
      preferences: updates.preferences || currentUser.preferences,
    };

    // Сохраняем в localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Имитируем задержку
    yield delay(600);

    // Успешный результат
    yield put(updateUserProfile.fulfilled(updatedUser, '', action.payload));

    toast.success('Профиль обновлен', { id: 'updateProfile' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка обновления профиля';

    // Неуспешный результат
    yield put(
      updateUserProfile.rejected(
        error as Error,
        '',
        action.payload,
        errorMessage
      )
    );

    toast.error(errorMessage, { id: 'updateProfile' });
  }
}

// Saga для автоматической загрузки профиля при инициализации
function* initializeUserSaga() {
  try {
    // Проверяем наличие токена
    const token = localStorage.getItem('authToken');
    if (token) {
      // Загружаем профиль пользователя
      yield put(loadUserProfile());
    }
  } catch (error) {
    // Ошибка инициализации пользователя
    toast.error('Ошибка инициализации пользователя');
  }
}

// Корневая saga для пользователей
export function* userSaga() {
  yield all([
    // Инициализация
    call(initializeUserSaga),

    // Слушаем действия
    takeLatest(loginUser.pending.type, loginUserSaga),
    takeLatest(registerUser.pending.type, registerUserSaga),
    takeLatest(logoutUser.pending.type, logoutUserSaga),
    takeLatest(loadUserProfile.pending.type, loadUserProfileSaga),
    takeLatest(updateUserProfile.pending.type, updateUserProfileSaga),
  ]);
}
