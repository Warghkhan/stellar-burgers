// Импортируем необходимые хуки и типы из React
import { forwardRef, useMemo } from 'react';
// Импортируем тип для пропсов категории ингредиентов
import { TIngredientsCategoryProps } from './type';
// Импортируем тип для ингредиента
import { TIngredient } from '@utils-types';
// Импортируем UI-компонент для отображения категории ингредиентов
import { IngredientsCategoryUI } from '../ui/ingredients-category';
// Импортируем хук useSelector для доступа к состоянию Redux
import { useSelector } from '../../services/store';
// Импортируем селектор для получения состояния конструктора бургера
import { getConstructorState } from '../../services/slices/constructorSlice';

// Компонент для отображения категории ингредиентов с использованием forwardRef
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем состояние конструктора бургера из Redux
  const burgerConstructor = useSelector(getConstructorState);

  // Используем useMemo для оптимизации подсчета ингредиентов
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor; // Деструктурируем состояние конструктора
    const counters: { [key: string]: number } = {}; // Объект для хранения счетчиков ингредиентов

    // Подсчитываем количество каждого ингредиента
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0; // Инициализация счетчика
      counters[ingredient._id]++; // Увеличиваем счетчик для текущего ингредиента
    });

    // Если выбрана булка, устанавливаем ее счетчик на 2
    if (bun) counters[bun._id] = 2;

    return counters; // Возвращаем объект с счетчиками
  }, [burgerConstructor]); // Зависимость от состояния конструктора

  // Возвращаем UI-компонент с данными о категории ингредиентов
  return (
    <IngredientsCategoryUI
      title={title} // Заголовок категории
      titleRef={titleRef} // Реф для заголовка
      ingredients={ingredients} // Список ингредиентов
      ingredientsCounters={ingredientsCounters} // Счетчики ингредиентов
      ref={ref} // Реф для передачи в родительский компонент
    />
  );
});
