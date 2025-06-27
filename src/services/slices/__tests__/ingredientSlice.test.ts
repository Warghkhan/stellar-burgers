// src/services/slices/__tests__/ingredientSlice.test.ts
import ingredientReducer, {
  initialState,
  getIngredients
} from '../ingredientSlice';

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png ',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png ',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png ',
    __v: 0
  }
];

describe('Тестирование ingredientSlice', () => {
  describe('Асинхронное действие getIngredients', () => {
    test('Начало запроса: pending', () => {
      const state = ingredientReducer(initialState, getIngredients.pending(''));

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Успешный запрос: fulfilled', () => {
      const state = ingredientReducer(
        initialState,
        getIngredients.fulfilled(ingredientsMockData, '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(ingredientsMockData);
    });

    test('Ошибка запроса: rejected', () => {
      const errorMessage = 'fetchIngredients.rejected';

      const state = ingredientReducer(
        initialState,
        getIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
