// Импорты из Redux Toolkit для создания слайса и асинхронных операций
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Импорты API-функций и типов данных пользователя и заказов
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

// Импорты типов для заказов и пользователя
import { TOrder, TUser } from '@utils-types';

// Утилиты для работы с куки
import { deleteCookie, setCookie } from '../../utils/cookie';

// Тип состояния хранилища Redux
import { RootState } from '../store';

// Тип состояния пользователя в Redux
export type UserState = {
  request: boolean; // Флаг загрузки запросов
  error: string | null; // Сообщение об ошибке
  response: TUser | null; // Ответ от сервера с данными пользователя
  registerData: TRegisterData | null; // Данные регистрации
  user: TUser | null; // Информация о текущем пользователе
  userOrders: TOrder[]; // Заказы пользователя
  isAuthChecked: boolean; // Флаг проверки аутентификации
  isAuthenticated: boolean; // Флаг, авторизован ли пользователь
  loginUserRequest: boolean; // Флаг загрузки при логине
};

// Начальное состояние пользователя
export const initialState: UserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false
};

// Асинхронный экшен регистрации пользователя
export const getRegisterUser = createAsyncThunk(
  'users/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    if (!data.success) {
      return data;
    }
    setCookie('accessToken', data.accessToken); // Сохраняем accessToken в куки
    localStorage.setItem('refreshToken', data.refreshToken); // Сохраняем refreshToken в localStorage
    return data;
  }
);

// Асинхронный экшен логина пользователя
export const getLoginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    if (!data.success) {
      return data;
    }
    setCookie('accessToken', data.accessToken); // Сохраняем accessToken в куки
    localStorage.setItem('refreshToken', data.refreshToken); // Сохраняем refreshToken в localStorage
    return data;
  }
);

// Асинхронные экшены для получения и обновления пользователя, заказов и выхода
export const getUser = createAsyncThunk('users/getUser', getUserApi);
export const updateUser = createAsyncThunk('users/updateUser', updateUserApi);
export const getOrders = createAsyncThunk('users/getOrders', getOrdersApi);
export const getLogoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken'); // Удаляем refreshToken из localStorage
  deleteCookie('accessToken'); // Удаляем accessToken из куки
});

// Создание слайса пользователя с редьюсерами и обработкой экшенов
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Очистка данных пользователя при выходе
    userLogout: (state) => {
      state.user = null;
    },
    // Сброс ошибок
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Обработка регистрации пользователя
    builder.addCase(getRegisterUser.pending, (state) => {
      state.request = true;
      state.error = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    });
    builder.addCase(getRegisterUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
      state.isAuthChecked = false;
    });
    builder.addCase(getRegisterUser.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.response = action.payload.user;
      state.user = action.payload.user;
      state.isAuthChecked = false;
      state.isAuthenticated = true;
    });

    // Обработка логина пользователя
    builder.addCase(getLoginUser.pending, (state) => {
      state.loginUserRequest = true;
      state.error = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    });
    builder.addCase(getLoginUser.rejected, (state, action) => {
      state.loginUserRequest = false;
      state.error = action.error.message as string;
      state.isAuthChecked = false;
    });
    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.loginUserRequest = false;
      state.error = null;
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
    });

    // Обработка получения пользователя
    builder.addCase(getUser.pending, (state) => {
      state.isAuthChecked = false;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isAuthChecked = true;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });

    // Обработка обновления пользователя
    builder.addCase(updateUser.pending, (state) => {
      state.request = true;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.response = action.payload.user;
    });

    // Обработка выхода пользователя
    builder.addCase(getLogoutUser.pending, (state) => {
      state.request = true;
      state.error = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    });
    builder.addCase(getLogoutUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
      state.isAuthChecked = false;
      state.isAuthenticated = true;
    });
    builder.addCase(getLogoutUser.fulfilled, (state) => {
      state.request = false;
      state.error = null;
      state.user = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    });

    // Обработка получения заказов пользователя
    builder.addCase(getOrders.pending, (state) => {
      state.request = true;
      state.error = null;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.userOrders = action.payload;
    });
  }
});

// Экспорт редьюсеров и селекторов
export const { userLogout, resetError } = userSlice.actions;
export const getUserState = (state: RootState): UserState => state.user;
export default userSlice.reducer;
