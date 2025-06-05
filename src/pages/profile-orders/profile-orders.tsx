// Импортируем необходимые компоненты и хуки из React
import { FC, useEffect } from 'react';
// Импортируем компонент UI для отображения заказов профиля
import { ProfileOrdersUI } from '@ui-pages';
// Импортируем селекторы и действия из среза пользователя
import { getOrders, getUserState } from '../../services/slices/userSlice';
// Импортируем хук useDispatch и useSelector для работы с Redux
import { useDispatch, useSelector } from '../../services/store';
// Импортируем действие для получения фидов
import { getFeeds } from '../../services/slices/feedSlice';
// Импортируем компонент прелоадера из UI-библиотеки
import { Preloader } from '@ui';

// Компонент для отображения заказов профиля пользователя
export const ProfileOrders: FC = () => {
  // Получаем заказы пользователя и состояние загрузки из Redux
  const { userOrders, request } = useSelector(getUserState);
  const dispatch = useDispatch();

  // Эффект для получения заказов и фидов при монтировании компонента
  useEffect(() => {
    dispatch(getOrders()); // Диспатчим действие для получения заказов
    dispatch(getFeeds()); // Диспатчим действие для получения фидов
  }, [dispatch]);

  // Если идет загрузка, отображаем прелоадер
  if (request === true) {
    return <Preloader />;
  }

  // Возвращаем UI-компонент с заказами пользователя
  return <ProfileOrdersUI orders={userOrders} />;
};
