//.src/components/feed-info/feed-info.tsx
// Импортируем необходимые типы и компоненты
import { TOrder } from '@utils-types'; // Тип для заказа
import { FeedInfoUI } from '../ui/feed-info'; // UI-компонент для отображения информации о заказах
import { getFeedState } from '../../services/slices/feedSlice'; // Селектор для получения состояния ленты заказов
import { useSelector } from '../../services/store'; // Хук для доступа к состоянию Redux
import { FC } from 'react'; // Тип для функциональных компонентов

// Функция для получения номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status) // Фильтруем заказы по статусу
    .map((item) => item.number) // Получаем номера отфильтрованных заказов
    .slice(0, 20); // Ограничиваем количество до 20

// Функциональный компонент для отображения информации о заказах
export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedState); // Получаем состояние заказов из Redux
  const feed = { orders, total, totalToday }; // Создаем объект с информацией о ленте заказов

  const readyOrders = getOrders(orders, 'done'); // Получаем готовые заказы
  const pendingOrders = getOrders(orders, 'pending'); // Получаем ожидающие заказы

  // Возвращаем UI-компонент с информацией о заказах
  return (
    <FeedInfoUI
      readyOrders={readyOrders} // Список готовых заказов
      pendingOrders={pendingOrders} // Список ожидающих заказов
      feed={feed} // Объект с информацией о ленте
    />
  );
};
