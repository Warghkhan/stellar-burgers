// Импортируем необходимые библиотеки и компоненты
import React, { FC } from 'react'; // Импортируем React и тип FC
import { Link, useLocation } from 'react-router-dom'; // Импортируем Link и хук useLocation для навигации
import styles from './app-header.module.css'; // Импортируем стили для заголовка приложения
import { TAppHeaderUIProps } from './type'; // Импортируем типы для пропсов заголовка
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components'; // Импортируем иконки из библиотеки

// Компонент заголовка приложения
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation(); // Получаем текущую локацию для определения активного пути

  // Функция для проверки, является ли путь активным
  const isActive = (path: string) => {
    // Проверяем, является ли текущий путь активным
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname.startsWith(path) && location.pathname !== '/';
  };

  // Рендерим заголовок приложения с навигацией
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Ссылка на главную страницу с иконкой бургера */}
          <Link
            to='/'
            className={`${styles.link} ${location.pathname === '/' && styles.link_active}`}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'} // Устанавливаем тип иконки в зависимости от активности
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          {/* Ссылка на ленту заказов с иконкой списка */}
          <Link
            to='/feed'
            className={`${styles.link} ${isActive('/feed') && styles.link_active}`}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          {/* Логотип, который ведет на главную страницу */}
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          {/* Ссылка на профиль пользователя с иконкой профиля */}
          <Link
            to='/profile'
            className={`${styles.link} ${isActive('/profile') && styles.link_active}`}
          >
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'} // Устанавливаем тип иконки в зависимости от активности
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
