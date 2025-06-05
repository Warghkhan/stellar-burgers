// Импортируем тип FC для функционального компонента из React
import { FC } from 'react';
// Импортируем компонент индикатора загрузки
import { Preloader } from '../ui/preloader';
// Импортируем UI-компонент для отображения деталей ингредиента
import { IngredientDetailsUI } from '../ui/ingredient-details';
// Импортируем хук useParams и тип Params для получения параметров маршрута
import { Params, useParams } from 'react-router-dom';
// Импортируем хук useSelector для доступа к Redux состоянию
import { useSelector } from '../../services/store';
// Импортируем селектор для получения состояния ингредиентов
import { getIngredientState } from '../../services/slices/ingredientSlice';

// Компонент отображения деталей выбранного ингредиента
export const IngredientDetails: FC = () => {
  // Получаем параметр id из URL
  const { id } = useParams<Params>();
  // Получаем список ингредиентов и состояние загрузки/ошибки из Redux
  const { ingredients, loading, error } = useSelector(getIngredientState);

  // Ищем ингредиент по id
  const ingredientData = ingredients.find((i) => i._id === id);

  // Если ингредиент не найден, показываем индикатор загрузки
  if (!ingredientData) {
    return <Preloader />;
  }

  // Если данные загружаются, отображаем сообщение о загрузке
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если произошла ошибка, отображаем сообщение об ошибке
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // Отображаем UI с деталями ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
