// Импортируем необходимые хуки и компоненты из React
import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

// Импортируем тип для режима вкладок
import { TTabMode } from '@utils-types';
// Импортируем UI-компонент для отображения ингредиентов бургера
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
// Импортируем селектор для получения состояния ингредиентов
import { getIngredientState } from '../../services/slices/ingredientSlice';
// Импортируем хук для доступа к состоянию Redux
import { useSelector } from '../../services/store';

// Компонент для отображения ингредиентов бургера
export const BurgerIngredients: FC = () => {
  const { ingredients, loading, error } = useSelector(getIngredientState); // Получаем состояние ингредиентов из Redux
  // Фильтруем ингредиенты по типу
  const buns = ingredients.filter((item) => item.type === 'bun'); // Булки
  const mains = ingredients.filter((item) => item.type === 'main'); // Основные ингредиенты
  const sauces = ingredients.filter((item) => item.type === 'sauce'); // Соусы

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun'); // Состояние текущей вкладки
  const titleBunRef = useRef<HTMLHeadingElement>(null); // Ссылка на заголовок булок
  const titleMainRef = useRef<HTMLHeadingElement>(null); // Ссылка на заголовок основных ингредиентов
  const titleSaucesRef = useRef<HTMLHeadingElement>(null); // Ссылка на заголовок соусов

  // Используем хук для отслеживания видимости заголовков
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0 // Уровень видимости для булок
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0 // Уровень видимости для основных ингредиентов
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0 // Уровень видимости для соусов
  });

  // Эффект для обновления текущей вкладки в зависимости от видимости заголовков
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun'); // Если булки видимы, устанавливаем вкладку "булка"
    } else if (inViewSauces) {
      setCurrentTab('sauce'); // Если соусы видимы, устанавливаем вкладку "соус"
    } else if (inViewFilling) {
      setCurrentTab('main'); // Если основные ингредиенты видимы, устанавливаем вкладку "основной"
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode); // Устанавливаем текущую вкладку
    // Прокрутка к соответствующему заголовку
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Если произошла ошибка, отображаем сообщение об ошибке
  if (error) {
    return <div>Ошибкdsfsfdsdfа: {error}</div>;
  }
  // Если данные загружаются, отображаем индикатор загрузки
  if (loading) {
    return <div>Загрузка...</div>;
  }
  // Возвращаем UI-компонент с ингредиентами
  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // Текущая активная вкладка
      buns={buns} // Список булок
      mains={mains} // Список основных ингредиентов
      sauces={sauces} // Список соусов
      titleBunRef={titleBunRef} // Реф на заголовок секции булок
      titleMainRef={titleMainRef} // Реф на заголовок секции основных ингредиентов
      titleSaucesRef={titleSaucesRef} // Реф на заголовок секции соусов
      bunsRef={bunsRef} // Реф для отслеживания видимости секции булок
      mainsRef={mainsRef} // Реф для отслеживания видимости секции основных
      saucesRef={saucesRef} // Реф для отслеживания видимости секции соусов
      onTabClick={onTabClick} // Обработчик клика по вкладкам
    />
  );
};
