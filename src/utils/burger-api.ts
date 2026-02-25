//.src/utils/burger-api.ts
// Импорт функций для работы с куками
import { setCookie, getCookie } from './cookie';
// Импорт типов данных для ингредиентов, заказов и пользователей
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

// URL API, получаемый из переменной окружения
const URL = process.env.BURGER_API_URL;

// Функция для проверки ответа сервера
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

// Тип для общего ответа сервера
type TServerResponse<T> = {
  success: boolean; // Флаг успешности запроса
} & T;

// Тип для ответа с обновленными токенами
type TRefreshResponse = TServerResponse<{
  refreshToken: string; // Обновленный refreshToken
  accessToken: string; // Обновленный accessToken
}>;

// Функция для обновления токена
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken') // Отправляем refreshToken
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res)) // Проверяем ответ
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData); // Обработка ошибки
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken); // Сохраняем новый refreshToken
      setCookie('accessToken', refreshData.accessToken, { expires: 1200 }); // Сохраняем новый accessToken в куки
      console.log('Updated accessToken cookie:', getCookie('accessToken')); // Логирование нового accessToken
      return refreshData; // Возвращаем данные
    });

// Функция для выполнения запросов с обновлением токена при его истечении
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options); // Выполняем запрос
    return await checkResponse<T>(res); // Проверяем ответ
  } catch (err) {
    // Если токен истек, обновляем его и повторяем запрос
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken(); // Обновляем токен
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken; // Устанавливаем новый accessToken
      }
      const res = await fetch(url, options); // Повторяем запрос
      return await checkResponse<T>(res); // Проверяем ответ
    } else {
      return Promise.reject(err); // Обработка других ошибок
    }
  }
};

// Тип для ответа с ингредиентами
type TIngredientsResponse = TServerResponse<{
  data: TIngredient[]; // Массив ингредиентов
}>;

// Тип для ответа с заказами
type TFeedsResponse = TServerResponse<{
  orders: TOrder[]; // Массив заказов
  total: number; // Общее количество заказов
  totalToday: number; // Количество заказов за сегодня
}>;

// Тип для ответа с заказами
export type TOrdersResponse = TServerResponse<{
  data: TOrder[]; // Массив заказов
}>;

// Функция для получения ингредиентов
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data.data; // Возвращаем данные об ингредиентах
      return Promise.reject(data); // Обработка ошибки
    });

// Функция для получения ингредиентов и сохранения json с ингридиентами
/*
  export const getIngredientsApi = () =>
  fetch(`${process.env.BURGER_API_URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) {
        const ingredientsData = data.data;

        // Создаем Blob с данными в формате JSON
        const blob = new Blob([JSON.stringify(ingredientsData, null, 2)], {
          type: 'application/json'
        });

        // Используем window.URL для генерации ссылки
        const url = window.URL.createObjectURL(blob);

        // Создаём ссылку и "скачиваем" файл
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ingredients.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Убираем элемент после клика

        window.URL.revokeObjectURL(url); // Очищаем память

        return ingredientsData;
      }
      return Promise.reject(data);
    });
  */

// Функция для получения всех заказов
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data; // Возвращаем данные
      return Promise.reject(data); // Обработка ошибки
    });
// Функция для получения заказов пользователя
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', // Заголовок для JSON
      authorization: getCookie('accessToken') // Токен авторизации из куков
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders; // Возвращаем массив заказов
    return Promise.reject(data); // Обработка ошибки
  });

// Тип для ответа с новым заказом
type TNewOrderResponse = TServerResponse<{
  order: TOrder; // Новый заказ
  name: string; // Имя заказа
}>;

// Функция для создания нового заказа
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', // Заголовок для JSON
      authorization: getCookie('accessToken') // Токен авторизации
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data // Передаем список ингредиентов
    })
  }).then((data) => {
    if (data?.success) return data; // Возвращаем данные о заказе
    return Promise.reject(data); // Обработка ошибки
  });

// Тип для ответа с конкретным заказом
export type TOrderResponse = TServerResponse<{
  orders: TOrder[]; // Массив заказов
}>;

// Функция для получения заказа по номеру
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json' // Заголовок для JSON
    }
  }).then((res) => checkResponse<TOrderResponse>(res)); // Проверяем ответ

// Тип для данных регистрации пользователя
export type TRegisterData = {
  email: string; // Email пользователя
  name: string; // Имя пользователя
  password: string; // Пароль пользователя
};

// Тип для ответа аутентификации
type TAuthResponse = TServerResponse<{
  refreshToken: string; // Обновленный refreshToken
  accessToken: string; // Обновленный accessToken
  user: TUser; // Информация о пользователе
}>;

// Функция для регистрации пользователя
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify(data) // Отправляем данные регистрации
  })
    .then((res) => checkResponse<TAuthResponse>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data; // Возвращаем данные
      return Promise.reject(data); // Обработка ошибки
    });

// Тип для данных входа пользователя
export type TLoginData = {
  email: string; // Email пользователя
  password: string; // Пароль пользователя
};

// Функция для входа пользователя
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify(data) // Отправляем данные для входа
  })
    .then((res) => checkResponse<TAuthResponse>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data; // Возвращаем данные
      return Promise.reject(data); // Обработка ошибки
    });

// Функция для запроса на сброс пароля
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify(data) // Отправляем email для сброса пароля
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data; // Возвращаем данные
      return Promise.reject(data); // Обработка ошибки
    });

// Функция для сброса пароля с новым паролем и токеном
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify(data) // Отправляем новый пароль и токен
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res)) // Проверяем ответ
    .then((data) => {
      if (data?.success) return data; // Возвращаем данные
      return Promise.reject(data); // Обработка ошибки
    });

// Тип для ответа с информацией о пользователе
export type TUserResponse = TServerResponse<{ user: TUser }>;

// Функция для получения информации о текущем пользователе
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken') // Токен авторизации
    } as HeadersInit
  });

// Функция для обновления данных пользователя
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', // Заголовок для JSON
      authorization: getCookie('accessToken') // Токен авторизации
    } as HeadersInit,
    body: JSON.stringify(user) // Отправляем обновленные данные
  });

// Функция для выхода пользователя из системы
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8' // Заголовок для JSON
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken') // Отправляем refreshToken для выхода
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res)); // Проверяем ответ
