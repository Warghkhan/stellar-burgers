// Импортируем необходимые хуки и типы из React
import { FC, SyntheticEvent, useState } from 'react';
// Импортируем UI-компонент регистрации
import { RegisterUI } from '@ui-pages';
// Импортируем действие для регистрации пользователя из среза userSlice
import { getRegisterUser } from '../../services/slices/userSlice';
// Импортируем хук useDispatch для отправки действий в Redux
import { useDispatch } from '../../services/store';
// Импортируем хук для навигации между страницами
import { useNavigate } from 'react-router-dom';

// Компонент регистрации пользователя
export const Register: FC = () => {
  // Локальное состояние для имени пользователя, email и пароля
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Хук для навигации
  const dispatch = useDispatch(); // Хук для диспатча действий Redux

  // Обработчик отправки формы регистрации
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Диспатчим действие регистрации пользователя
    dispatch(getRegisterUser({ email, password, name: userName }));
    // Переходим на страницу логина после регистрации
    navigate('/login');
  };

  // Рендерим UI-компонент регистрации с необходимыми пропсами
  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
