// Импортируем необходимые компоненты из UI-библиотеки
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
// Импортируем React и типы
import { FC, memo } from 'react';
// Импортируем компоненты для навигации
import { Link } from 'react-router-dom';
// Импортируем стили для ингредиента
import styles from './burger-ingredient.module.css';
// Импортируем стили для заголовка приложения
import style from './app-header.module.css';
// Импортируем типы пропсов компонента
import { TBurgerIngredientUIProps } from './type';

// Компонент для отображения ингредиента бургера
export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient; // Деструктурируем свойства ингредиента

    return (
      <li className={styles.container} data-cy={_id}>
        {/* Ссылка на страницу ингредиента с передачей состояния */}
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
        >
          {/* Отображение счетчика, если ингредиент добавлен */}
          {count && <Counter count={count} />}
          {/* Изображение ингредиента */}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            {/* Отображение цены ингредиента */}
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          {/* Название ингредиента */}
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        {/* Кнопка добавления ингредиента */}
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
