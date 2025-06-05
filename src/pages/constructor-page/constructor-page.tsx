// Импортируем стили для страницы конструктора бургеров
import styles from './constructor-page.module.css';
// Импортируем компоненты для отображения ингредиентов и конструктора бургера
import { BurgerIngredients, BurgerConstructor } from '../../components';
// Импортируем компонент прелоадера для отображения загрузки
import { Preloader } from '../../components/ui';
// Импортируем тип FC для функционального компонента из React
import { FC } from 'react';
// Импортируем селектор состояния ингредиентов из среза
import { getIngredientState } from '../../services/slices/ingredientSlice';
// Импортируем хук useSelector для доступа к состоянию Redux
import { useSelector } from '../../services/store';

// Компонент страницы конструктора бургеров
export const ConstructorPage: FC = () => {
  // Получаем состояние загрузки ингредиентов из Redux
  const isIngredientsLoading = useSelector(getIngredientState).loading;

  return (
    <>
      {/* Если ингредиенты загружаются, отображаем прелоадер */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        // Основное содержимое страницы конструктора
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            {/* Компоненты для выбора ингредиентов и сборки бургера */}
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
