// Импортируем необходимые хуки и компоненты из React
import { FC, SyntheticEvent, useEffect, useState } from 'react';
// Импортируем компонент UI для профиля пользователя
import { ProfileUI } from '@ui-pages';
// Импортируем хук useSelector для доступа к состоянию Redux
import { useSelector } from '../../services/store';
// Импортируем действия и селекторы из среза пользователя
import {
  getUser,
  getUserState,
  updateUser
} from '../../services/slices/userSlice';
// Импортируем хук useDispatch для отправки действий в Redux
import { useDispatch } from '../../services/store';
// Импортируем компонент прелоадера из UI-библиотеки
import { Preloader } from '@ui';

// Компонент профиля пользователя
export const Profile: FC = () => {
  // Получаем данные пользователя и состояние загрузки из Redux
  const data = useSelector(getUserState).user;
  const loading = useSelector(getUserState).request;
  const [isFormChanged, setIsFormChanged] = useState(false); // Состояние для отслеживания изменений формы
  const dispatch = useDispatch();

  // Инициализируем объект пользователя
  const user = {
    name: data?.name || '',
    email: data?.email || ''
  };

  // Локальное состояние для значений формы
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  // Эффект для обновления значений формы при изменении данных пользователя
  useEffect(() => {
    if (data) {
      setFormValue({
        name: data.name || '',
        email: data.email || '',
        password: ''
      });
    }
  }, [data]);

  // Эффект для проверки изменений в форме
  useEffect(() => {
    setIsFormChanged(
      formValue.name !== user.name ||
        formValue.email !== user.email ||
        !!formValue.password
    );
  }, [formValue, user]);

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue))
      .unwrap()
      .then(() => {
        setIsFormChanged(false); // Сбрасываем состояние изменения формы
        setFormValue({ ...formValue, password: '' }); // Очищаем пароль
        dispatch(getUser()); // Получаем обновленные данные пользователя
      });
  };

  // Если данные загружаются, отображаем прелоадер
  if (loading) {
    return <Preloader />;
  }

  // Обработчик отмены изменений в форме
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    setIsFormChanged(false); // Сбрасываем состояние изменения формы
  };

  // Обработчик изменения значений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value // Обновляем значение поля формы
    }));
  };

  // Возвращаем UI-компонент профиля с необходимыми пропсами и обработчиками
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
