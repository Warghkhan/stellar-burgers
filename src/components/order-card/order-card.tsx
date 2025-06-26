//.src/components/order-card/order-card.tsx
// Импортируем тип FC, memo и хук useMemo из React
import { FC, memo, useMemo } from 'react';
// Импортируем хук useLocation для получения текущего маршрута
import { useLocation } from 'react-router-dom';

// Импортируем типы пропсов компонента
import { OrderCardProps } from './type';
// Импортируем тип ингредиента
import { TIngredient } from '@utils-types';
// Импортируем UI-компонент для отображения карточки заказа
import { OrderCardUI } from '../ui/order-card';
// Импортируем селектор для получения состояния ингредиентов
import { getIngredientState } from '../../services/slices/ingredientSlice';
// Импортируем хук useSelector для доступа к состоянию Redux
import { useSelector } from '../../services/store';

// Максимальное количество ингредиентов для отображения
const maxIngredients = 6;

// Компонент карточки заказа с мемоизацией для оптимизации рендеринга
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получаем текущую локацию маршрута
  const location = useLocation();

  // Получаем список ингредиентов из Redux
  const { ingredients } = useSelector(getIngredientState);

  // Мемоизируем вычисление информации о заказе для оптимизации
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null; // Если ингредиенты не загружены, возвращаем null

    // Собираем подробную информацию по ингредиентам заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        // Находим ингредиент по id
        const ingredient = ingredients.find(
          (currentIngredient) => currentIngredient._id === item
        );
        // Если найден, добавляем к аккумулятору
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Считаем общую стоимость ингредиентов
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничиваем отображаемое количество ингредиентов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Вычисляем количество ингредиентов, не вошедших в отображение
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Преобразуем дату создания заказа в объект Date
    const date = new Date(order.createdAt);

    // Возвращаем расширенную информацию о заказе
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  // Если информация о заказе не готова, не рендерим компонент
  if (!orderInfo) return null;

  // Рендерим UI-компонент карточки заказа с переданными данными
  return (
    <OrderCardUI
      orderInfo={orderInfo} // Информация о заказе с ингредиентами и суммой
      maxIngredients={maxIngredients} // Максимальное число отображаемых ингредиентов
      locationState={{ background: location }} // Текущее местоположение для роутинга
    />
  );
});
