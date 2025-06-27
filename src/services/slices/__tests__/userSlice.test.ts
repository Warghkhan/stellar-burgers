//src/services/slices/__tests__/userSlice.test.ts
import userReducer, {
  getRegisterUser,
  getLoginUser,
  getLogoutUser,
  getUser,
  updateUser,
  getOrders,
  initialState
} from '../userSlice';

// Mock-данные
const userMockData = {
  email: 'example@example.mail',
  name: 'Example'
};

const registerMockData = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

const loginMockData = {
  email: 'example@example.mail',
  password: 'Example'
};

describe('Тестирование userSlice', () => {
  describe('Асинхронная функция регистрации: getRegisterUser', () => {
    test('Начало запроса: pending', () => {
      const state = userReducer(
        initialState,
        getRegisterUser.pending('', registerMockData)
      );

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    test('Успешная регистрация: fulfilled', () => {
      const payload = {
        success: true,
        refreshToken: 'some-refresh-token',
        accessToken: 'some-access-token',
        user: {
          email: 'example@example.mail',
          name: 'Example'
        }
      };

      const state = userReducer(
        initialState,
        getRegisterUser.fulfilled(payload, '', registerMockData)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBe(true);
    });

    test('Ошибка регистрации: rejected', () => {
      const error = 'Ошибка регистрации';

      const state = userReducer(
        initialState,
        getRegisterUser.rejected(new Error(error), '', registerMockData)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBe(error);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Асинхронная функция входа: getLoginUser', () => {
    test('Начало запроса: pending', () => {
      const state = userReducer(
        initialState,
        getLoginUser.pending('', loginMockData)
      );

      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    test('Успешный вход: fulfilled', () => {
      const payload = {
        success: true,
        refreshToken: 'some-refresh-token',
        accessToken: 'some-access-token',
        user: {
          email: 'example@example.mail',
          name: 'Example'
        }
      };

      const state = userReducer(
        initialState,
        getLoginUser.fulfilled(payload, '', loginMockData)
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBe(true);
    });

    test('Ошибка входа: rejected', () => {
      const error = 'Ошибка входа';

      const state = userReducer(
        initialState,
        getLoginUser.rejected(new Error(error), '', loginMockData)
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(error);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Асинхронная функция выхода: getLogoutUser', () => {
    test('Успешный выход: fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: userMockData,
        isAuthenticated: true
      };

      const state = userReducer(
        stateWithUser,
        getLogoutUser.fulfilled(undefined, '')
      );

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    test('Ошибка выхода: rejected', () => {
      const error = 'Ошибка выхода';

      const state = userReducer(
        initialState,
        getLogoutUser.rejected(new Error(error), '')
      );

      expect(state.error).toBe(error);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('Асинхронная функция получения пользователя: getUser', () => {
    test('Успешное получение пользователя: fulfilled', () => {
      const payload = {
        success: true,
        refreshToken: 'some-refresh-token',
        accessToken: 'some-access-token',
        user: userMockData
      };

      const state = userReducer(initialState, getUser.fulfilled(payload, ''));

      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBe(true);
    });

    test('Ошибка получения пользователя: rejected', () => {
      const error = 'Ошибка получения пользователя';

      const state = userReducer(
        initialState,
        getUser.rejected(new Error(error), '')
      );

      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Асинхронная функция обновления пользователя: updateUser', () => {
    test('Начало запроса: pending', () => {
      const state = userReducer(
        initialState,
        updateUser.pending('', userMockData)
      );

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Успешное обновление: fulfilled', () => {
      const payload = {
        success: true,
        refreshToken: 'some-refresh-token',
        accessToken: 'some-access-token',
        user: userMockData
      };

      const state = userReducer(
        initialState,
        updateUser.fulfilled(payload, '', userMockData)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.response).toEqual(userMockData);
      expect(state.user).toBeNull();
    });

    test('Ошибка обновления: rejected', () => {
      const error = 'Ошибка обновления';

      const state = userReducer(
        initialState,
        updateUser.rejected(new Error(error), '', userMockData)
      );

      expect(state.request).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('Асинхронная функция получения заказов: getOrders', () => {
    test('Начало запроса: pending', () => {
      const state = userReducer(initialState, getOrders.pending(''));

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Успешное получение заказов: fulfilled', () => {
      const ordersMock = [
        {
          _id: '6622337897ede0001d0666b5',
          status: 'done',
          name: 'EXAMPLE_NAME',
          createdAt: '2024-04-19T09:03:52.748Z',
          updatedAt: '2024-04-19T09:03:58.057Z',
          number: 38321,
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0941']
        }
      ];

      const state = userReducer(
        initialState,
        getOrders.fulfilled(ordersMock, '')
      );

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.userOrders).toEqual(ordersMock);
    });

    test('Ошибка получения заказов: rejected', () => {
      const error = 'Ошибка получения заказов';

      const state = userReducer(
        initialState,
        getOrders.rejected(new Error(error), '')
      );

      expect(state.request).toBe(false);
      expect(state.error).toBe(error);
    });
  });
});
