// Импортируем необходимые хуки и компоненты из React и Redux
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
// Импортируем компонент прелоадера из UI-библиотеки
import { Preloader } from '@ui';
// Импортируем UI-компонент для отображения списка заказов
import { FeedUI } from '@ui-pages';
// Импортируем действия и селекторы из среза для работы с заказами
import { getFeeds, getFeedState } from '../../services/slices/feedSlice';

// Компонент для отображения списка заказов
export const Feed: FC = () => {
  // Получаем заказы и состояние загрузки из Redux
  const { orders, loading } = useSelector(getFeedState);
  const dispatch = useDispatch();

  // Эффект для получения заказов при монтировании компонента
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]); // Добавляем dispatch в зависимости для предотвращения предупреждений

  // Если данные загружаются, отображаем прелоадер
  if (loading) {
    return <Preloader />;
  }

  // Возвращаем UI-компонент с заказами и обработчиком обновления
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
