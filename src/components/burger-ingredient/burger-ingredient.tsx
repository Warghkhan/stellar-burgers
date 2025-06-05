// Импортируем необходимые хуки и компоненты из React
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

// Импортируем UI-компонент для отображения ингредиента бургера
import { BurgerIngredientUI } from '@ui';
// Импортируем типы пропсов для компонента
import { TBurgerIngredientProps } from './type';
// Импортируем действие для добавления ингредиента в конструктор
import { addIngredientToConstructor } from '../../services/slices/constructorSlice';
// Импортируем хук для отправки действий Redux
import { useDispatch } from '../../services/store';

// Компонент для отображения ингредиента бургера с мемоизацией для оптимизации рендера
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Получаем текущее местоположение для обработки навигации
    const dispatch = useDispatch(); // Получаем dispatch для отправки действий

    // Обработчик добавления ингредиента в конструктор
    const handleAdd = () => {
      dispatch(addIngredientToConstructor(ingredient)); // Отправляем действие для добавления ингредиента
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные ингредиента
        count={count} // Количество данного ингредиента
        locationState={{ background: location }} // Состояние для навигации
        handleAdd={handleAdd} // Функция добавления ингредиента
      />
    );
  }
);
