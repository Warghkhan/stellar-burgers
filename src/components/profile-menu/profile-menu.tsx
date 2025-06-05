// Импортируем необходимые хуки и компоненты из React и React Router
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Импортируем UI-компонент меню профиля
import { ProfileMenuUI } from '@ui';
// Импортируем хук useDispatch для работы с Redux
import { useDispatch } from '../../services/store';
// Импортируем действие для выхода пользователя
import { getLogoutUser } from '../../services/slices/userSlice';

// Компонент меню профиля
export const ProfileMenu: FC = () => {
  const { pathname } = useLocation(); // Получаем текущий путь
  const dispatch = useDispatch(); // Инициализируем диспетчер для отправки действий
  const navigate = useNavigate(); // Инициализируем навигатор для перехода между страницами

  // Функция для обработки выхода пользователя
  const handleLogout = () => {
    dispatch(getLogoutUser()); // Отправляем действие для выхода
    navigate('/Login'); // Перенаправляем на страницу логина
  };

  // Рендерим UI-компонент меню профиля с обработчиком выхода и текущим путем
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
