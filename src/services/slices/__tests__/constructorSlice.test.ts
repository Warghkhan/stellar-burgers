//src/services/slices/__tests__/constructorSlice.test.ts
import constructorReducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
  initialState
} from '../../slices/constructorSlice';

// Mock-данные
const bunMockData = {
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
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png ',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png ',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png ',
  __v: 0
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa093f',
  name: 'Говядина',
  type: 'main',
  proteins: 50,
  fat: 30,
  carbohydrates: 10,
  calories: 300,
  price: 800,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png ',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png ',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png ',
  __v: 0
};

describe('Тестирование constructorSlice', () => {
  describe('Работа с булками', () => {
    test('Добавление булки через addIngredientToConstructor', () => {
      const action = addIngredientToConstructor(bunMockData);
      const state = constructorReducer(initialState, action);

      expect(state.constructorItems.bun).toEqual(
        expect.objectContaining({
          ...bunMockData,
          id: expect.any(String)
        })
      );
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Работа с ингредиентами', () => {
    test('Добавление ингредиента', () => {
      const action = addIngredientToConstructor(ingredient1MockData);
      const state = constructorReducer(initialState, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(
        expect.objectContaining({
          ...ingredient1MockData,
          id: expect.any(String)
        })
      );
      expect(state.constructorItems.bun).toBeNull();
    });

    test('Удаление ингредиента', () => {
      const initialIngredients = [
        { ...ingredient1MockData, id: '1' },
        { ...ingredient2MockData, id: '2' }
      ];

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: initialIngredients
        }
      };

      const action = removeIngredientFromConstructor('1');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].id).toBe('2');
    });

    test('Перемещение ингредиента вверх', () => {
      const initialIngredients = [
        { ...ingredient1MockData, id: '1' },
        { ...ingredient2MockData, id: '2' }
      ];

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: initialIngredients
        }
      };

      const action = moveIngredientUp('2');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('1');
    });

    test('Перемещение ингредиента вниз', () => {
      const initialIngredients = [
        { ...ingredient1MockData, id: '1' },
        { ...ingredient2MockData, id: '2' }
      ];

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: initialIngredients
        }
      };

      const action = moveIngredientDown('1');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('1');
    });
  });

  test('Очистка конструктора', () => {
    const stateWithItems = {
      ...initialState,
      constructorItems: {
        bun: { ...bunMockData, id: 'bun-id' },
        ingredients: [{ ...ingredient1MockData, id: '1' }]
      }
    };

    const action = resetConstructor();
    const state = constructorReducer(stateWithItems, action);

    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });
});
