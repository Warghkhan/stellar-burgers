//src/services/slices/__tests__/orderSlice.test.ts
import { getOrderByNumber } from '../orderSlice';
import orderReducer, { initialState } from '../orderSlice';

// Mock-данные
const mockOrder = {
  _id: '6622337897ede0001d0666b5',
  status: 'done',
  name: 'EXAMPLE_NAME',
  createdAt: '2024-04-19T09:03:52.748Z',
  updatedAt: '2024-04-19T09:03:58.057Z',
  number: 38321,
  ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0941']
};

describe('Тестирование orderSlice', () => {
  describe('Асинхронное действие getOrderByNumber', () => {
    test('Начало запроса: pending', () => {
      const state = orderReducer(
        initialState,
        getOrderByNumber.pending('', 38321)
      );

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
      expect(state.getOrderByNumberResponse).toBeNull();
    });

    test('Успешный запрос: fulfilled', () => {
      const payload = { orders: [mockOrder] };

      const state = orderReducer(
        initialState,
        getOrderByNumber.fulfilled(payload, '', 38321)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.getOrderByNumberResponse).toEqual(mockOrder);
    });

    test('Ошибка запроса: rejected', () => {
      const errorMessage = 'Ошибка получения заказа по номеру';

      const state = orderReducer(
        initialState,
        getOrderByNumber.rejected(new Error(errorMessage), '', 38321)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.getOrderByNumberResponse).toBeNull();
    });
  });
});
