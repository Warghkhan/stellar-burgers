//.src/services/slices/orderSlice.ts
// Импорт API для получения заказа по номеру
import { getOrderByNumberApi } from '@api';

// Импорт необходимых функций из Redux Toolkit
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Импорт типов данных для заказа
import { TOrder } from '@utils-types';

// Импорт типа состояния из хранилища Redux
import { RootState } from '../store';

// Тип состояния заказа в Redux
type OrderState = {
  orders: TOrder[]; // Список заказов
  getOrderByNumberResponse: TOrder | null; // Ответ на запрос получения заказа по номеру
  error: string | null; // Сообщение об ошибке
  request: boolean; // Флаг загрузки запроса
  responseOrder: null; // Ответ заказа (пока не используется)
};

// Начальное состояние заказа
export const initialState: OrderState = {
  orders: [],
  getOrderByNumberResponse: null,
  error: null,
  request: false,
  responseOrder: null
};

// Асинхронный экшен для получения заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number) => getOrderByNumberApi(number) // Вызов API для получения заказа
);

// Создание слайса заказа с редьюсерами и обработкой экшенов
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {}, // Редьюсеры не используются
  extraReducers: (builder) => {
    // Обработка состояния загрузки заказа
    builder.addCase(getOrderByNumber.pending, (state) => {
      state.error = null; // Сброс ошибки перед запросом
      state.request = true; // Установка флага загрузки
    });
    // Обработка ошибки при получении заказа
    builder.addCase(getOrderByNumber.rejected, (state, action) => {
      state.error = action.error.message as string; // Установка сообщения об ошибке
      state.request = false; // Сброс флага загрузки
    });
    // Обработка успешного получения заказа
    builder.addCase(getOrderByNumber.fulfilled, (state, action) => {
      state.error = null; // Сброс ошибки
      state.request = false; // Сброс флага загрузки
      state.getOrderByNumberResponse = action.payload.orders[0]; // Сохранение полученного заказа
    });
  }
});

// Селектор для получения состояния заказа из хранилища
export const getOrderState = (state: RootState): OrderState => state.order;

// Экспорт редьюсера слайса заказа
export default orderSlice.reducer;
