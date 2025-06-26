//.src/services/slices/constructorSlice.ts
// Импортируем необходимые функции и типы из Redux Toolkit
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
// Импортируем типы для ингредиентов и заказов
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
// Импортируем тип корневого состояния
import { RootState } from '../store';
// Импортируем API для заказа бургера
import { orderBurgerApi } from '@api';

// Определяем тип состояния конструктора
type ConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null; // Булка
    ingredients: TConstructorIngredient[]; // Ингредиенты
  };
  orderRequest: boolean; // Статус запроса на заказ
  orderModalData: TOrder | null; // Данные заказа для модального окна
  loading: boolean; // Статус загрузки
  error: string | null; // Ошибка, если есть
};

// Начальное состояние конструктора
export const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

// Создаем асинхронное действие для заказа бургера
export const getOrderBurger = createAsyncThunk(
  'user/newUser Order',
  orderBurgerApi
);

// Функция для перемещения ингредиента в массиве
const moveIngredient = (
  ingredients: TConstructorIngredient[],
  fromIndex: number,
  toIndex: number
) => {
  const [movedIngredient] = ingredients.splice(fromIndex, 1);
  ingredients.splice(toIndex, 0, movedIngredient);
};

// Создаем срез состояния конструктора
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredientToConstructor: {
      prepare: (item: TIngredient) => {
        const id = nanoid(); // Генерация уникального ID
        return { payload: { id, ...item } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload; // Устанавливаем булку
        } else {
          state.constructorItems.ingredients.push(action.payload); // Добавляем ингредиент
        }
      }
    },

    // Удаление ингредиента из конструктора
    removeIngredientFromConstructor: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload // Фильтруем по ID
        );
    },

    // Перемещение ингредиента вверх
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index > 0) {
        moveIngredient(state.constructorItems.ingredients, index, index - 1);
      }
    },

    // Перемещение ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        moveIngredient(state.constructorItems.ingredients, index, index + 1);
      }
    },

    // Сброс конструктора
    resetConstructor: (state) => {
      state.constructorItems.ingredients = [];
      state.constructorItems.bun = null;
    },

    // Установка статуса запроса
    setRequest: (state, action) => {
      state.orderRequest = action.payload;
    },

    // Сброс данных модального окна
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  // Обработка дополнительных редьюсеров для асинхронного действия
  extraReducers: (builder) => {
    builder.addCase(getOrderBurger.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.orderRequest = true;
    });
    builder.addCase(getOrderBurger.rejected, (state, action) => {
      state.loading = false;
      state.orderRequest = false;
      state.error = action.error.message as string;
    });
    builder.addCase(getOrderBurger.fulfilled, (state, action) => {
      state.loading = false;
      state.orderRequest = false;
      state.error = null;
      state.orderModalData = action.payload.order; // Устанавливаем данные заказа
      // Сбрасываем состояние конструктора после успешного заказа
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
      console.log(action.payload); // Логируем данные заказа
    });
  }
});

// Селектор для получения состояния конструктора из корневого состояния
const constructorSliceSelectors = (state: RootState): ConstructorState =>
  state.constructorItems;

// Создаем селектор для получения ингредиентов и булки конструктора
export const getConstructorState = createSelector(
  [constructorSliceSelectors],
  (state) => ({
    ingredients: state.constructorItems.ingredients,
    bun: state.constructorItems.bun
  })
);

// Селектор для получения статуса запроса заказа
export const getOrderRequest = (state: RootState) =>
  state.constructorItems.orderRequest;

// Селектор для получения данных модального окна заказа
export const getOrderModalData = (state: RootState) =>
  state.constructorItems.orderModalData;

// Экспортируем действия конструктора
export const {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  setRequest,
  resetModal
} = constructorSlice.actions;

// Экспортируем редьюсер конструктора по умолчанию
export default constructorSlice.reducer;
