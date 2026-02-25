//.src/services/slices/ingredientSlice.ts
// Импортируем тип ингредиента
import { TIngredient } from '@utils-types';
// Импортируем функции для создания срезов состояния и асинхронных действий из Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Импортируем API для получения ингредиентов
import { getIngredientsApi } from '@api';
// Импортируем тип корневого состояния приложения
import { RootState } from '../store';

// Определяем тип состояния ингредиентов
export type IngredientState = {
  ingredients: TIngredient[]; // Список ингредиентов
  loading: boolean; // Статус загрузки данных
  error: string | null; // Ошибка запроса, если есть
};

// Начальное состояние ингредиентов
export const initialState: IngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

// Создаем асинхронное действие для получения ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

// Создаем срез состояния для ингредиентов
const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Нет обычных редьюсеров
  extraReducers: (builder) => {
    // Обработка состояния загрузки
    builder.addCase(getIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // Обработка ошибки запроса
    builder.addCase(getIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
    });
    // Обработка успешного получения данных
    builder.addCase(getIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.ingredients = action.payload; // Устанавливаем полученные ингредиенты
    });
  }
});

// Селектор для получения состояния ингредиентов из корневого состояния
export const getIngredientState = (state: RootState): IngredientState =>
  state.ingredient;

// Экспортируем редьюсер ингредиентов по умолчанию
export default ingredientSlice.reducer;
