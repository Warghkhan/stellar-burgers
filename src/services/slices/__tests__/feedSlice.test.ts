//src/services/slices/__tests__/feedSlice.test.ts

import feedReducer, { getFeeds, initialState } from '../feedSlice';

// Mock-данные
const feedsMockData = {
  success: true,
  orders: [],
  total: 1,
  totalToday: 1
};

describe('Тестирование feedSlice', () => {
  describe('Асинхронное действие getFeeds', () => {
    test('Начало запроса: pending', () => {
      const state = feedReducer(initialState, getFeeds.pending('', undefined));

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Успешный запрос: fulfilled', () => {
      const state = feedReducer(
        initialState,
        getFeeds.fulfilled(feedsMockData, '', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(feedsMockData.orders);
      expect(state.total).toEqual(feedsMockData.total);
      expect(state.totalToday).toEqual(feedsMockData.totalToday);
    });

    test('Ошибка запроса: rejected', () => {
      const errorMessage = 'Ошибка получения ленты заказов';

      const state = feedReducer(
        initialState,
        getFeeds.rejected(new Error(errorMessage), '', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });
});
