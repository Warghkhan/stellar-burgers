//.src/components/burger-constructor/burger-constructor-element.tsx
// Импортируем React и оптимизацию мемоизации
import { FC, memo } from 'react';
// Импортируем UI-компонент для элемента конструктора бургера
import { BurgerConstructorElementUI } from '@ui';
// Импортируем типы пропсов компонента
import { BurgerConstructorElementProps } from './type';
// Импортируем действия для изменения состояния конструктора
import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredientFromConstructor
} from '../../services/slices/constructorSlice';
// Импортируем хук для отправки действий Redux
import { useDispatch } from '../../services/store';

// Компонент элемента конструктора бургера с мемоизацией для оптимизации рендера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // Получаем dispatch для отправки действий

    // Обработчик перемещения ингредиента вниз, если не последний элемент
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredientDown(ingredient.id));
      }
    };

    // Обработчик перемещения ингредиента вверх, если не первый элемент
    const handleMoveUp = () => {
      if (index < totalItems + 1) {
        dispatch(moveIngredientUp(ingredient.id));
      }
    };

    // Обработчик удаления ингредиента из конструктора
    const handleClose = () => {
      dispatch(removeIngredientFromConstructor(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient} // Данные ингредиента
        index={index} // Индекс элемента в списке
        totalItems={totalItems} // Общее количество элементов
        handleMoveUp={handleMoveUp} // Функция перемещения вверх
        handleMoveDown={handleMoveDown} // Функция перемещения вниз
        handleClose={handleClose} // Функция удаления элемента
      />
    );
  }
);
