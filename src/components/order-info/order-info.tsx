// Импортируем необходимые хуки и типы из React
import { FC, useEffect, useMemo } from 'react';
// Импортируем UI-компоненты для отображения прелоадера и информации о заказе
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
// Импортируем тип ингредиента
import { TIngredient } from '@utils-types';
// Импортируем селекторы для получения состояния ингредиентов и заказа
import { getIngredientState } from '../../services/slices/ingredientSlice';
import {
  getOrderByNumber,
  getOrderState
} from '../../services/slices/orderSlice';
// Импортируем хуки useSelector и useDispatch для работы с Redux
import { useSelector, useDispatch } from '../../services/store';
// Импортируем хук useParams для получения параметров маршрута
import { useParams } from 'react-router-dom';

// Компонент для отображения информации о заказе
export const OrderInfo: FC = () => {
  // Получаем состояние заказа из Redux
  const { getOrderByNumberResponse, request } = useSelector(getOrderState);
  const dispatch = useDispatch(); // Инициализируем диспетчер для отправки действий
  const number = Number(useParams().number); // Получаем номер заказа из параметров маршрута

  // Получаем список ингредиентов из Redux
  const { ingredients } = useSelector(getIngredientState);

  // Эффект для получения информации о заказе по номеру
  useEffect(() => {
    dispatch(getOrderByNumber(number)); // Запрашиваем информацию о заказе
  }, [dispatch, number]); // Зависимости эффекта

  // Мемоизируем вычисление информации о заказе для оптимизации
  const orderInfo = useMemo(() => {
    // Проверяем, есть ли ответ и загружены ли ингредиенты
    if (!getOrderByNumberResponse || !ingredients.length) return null;

    // Преобразуем дату создания заказа в объект Date
    const date = new Date(getOrderByNumberResponse.createdAt);

    // Тип для хранения ингредиентов с учетом их количества
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Собираем информацию о ингредиентах заказа
    const ingredientsInfo = getOrderByNumberResponse.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Если ингредиент еще не добавлен в аккумулятор
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item); // Находим ингредиент
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1 // Устанавливаем начальное количество
            };
          }
        } else {
          acc[item].count++; // Увеличиваем счетчик для существующего ингредиента
        }

        return acc; // Возвращаем обновленный аккумулятор
      },
      {}
    );

    // Считаем общую стоимость ингредиентов
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем полную информацию о заказе
    return {
      ...getOrderByNumberResponse,
      ingredientsInfo,
      date,
      total
    };
  }, [getOrderByNumberResponse, ingredients]); // Зависимости для мемоизации

  // Если информация о заказе не готова или идет запрос, показываем прелоадер
  if (!orderInfo || request) {
    return <Preloader />;
  }

  // Рендерим UI-компонент с информацией о заказе
  return <OrderInfoUI orderInfo={orderInfo} />;
};
