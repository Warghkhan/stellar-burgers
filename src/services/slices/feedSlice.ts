//.src/services/slices/feedSlice.ts
// Импортируем API для получения ленты заказов
import { getFeedsApi } from '@api';
// Импортируем функции для создания асинхронных действий и срезов состояния из Redux Toolkit
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Импортируем тип заказа
import { TOrder } from '@utils-types';
// Импортируем тип корневого состояния приложения
import { RootState } from '../store';

// Определяем тип состояния ленты заказов
export type FeedState = {
  orders: TOrder[]; // Список заказов
  total: number; // Общее количество заказов
  totalToday: number; // Количество заказов за сегодня
  loading: boolean; // Статус загрузки данных
  error: string | null; // Ошибка запроса, если есть
};

// Начальное состояние ленты заказов
export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Создаем асинхронное действие для получения ленты заказов
export const getFeeds = createAsyncThunk('feeds/all', getFeedsApi);

// Создаем срез состояния ленты заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {}, // Нет обычных редьюсеров
  extraReducers: (builder) => {
    builder
      // Обработка состояния загрузки
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обработка ошибки запроса
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      // Обработка успешного получения данных
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

// Селектор для получения состояния ленты заказов из корневого состояния
export const getFeedState = (state: RootState): FeedState => state.feed;

// Экспортируем редьюсер ленты заказов по умолчанию
export default feedSlice.reducer;
