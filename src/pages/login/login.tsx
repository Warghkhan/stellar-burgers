// Импортируем хуки и типы из React
import { FC, SyntheticEvent, useState } from 'react';
// Импортируем компонент UI для страницы логина
import { LoginUI } from '@ui-pages';
// Импортируем компонент для навигации из react-router-dom
import { Navigate } from 'react-router-dom';
// Импортируем хук useSelector и useDispatch из локального хранилища Redux
import { useSelector, useDispatch } from '../../services/store';
// Импортируем селекторы и действия из среза пользователя
import { getLoginUser, getUserState } from '../../services/slices/userSlice';

// Компонент страницы логина
export const Login: FC = () => {
  // Локальное состояние для email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Получаем состояние ошибки и аутентификации пользователя из Redux
  const { error, isAuthenticated } = useSelector(getUserState);

  const dispatch = useDispatch();

  // Обработчик отправки формы логина
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Проверяем, что поля заполнены
    if (!email || !password) {
      return;
    }
    // Диспатчим действие для логина пользователя
    dispatch(getLoginUser({ email, password }));
  };

  // Если пользователь аутентифицирован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  // Отображаем UI-компонент логина с необходимыми пропсами и обработчиками
  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
