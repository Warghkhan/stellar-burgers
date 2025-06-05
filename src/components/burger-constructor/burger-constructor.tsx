// Импортируем необходимые хуки и компоненты из React
import { FC, useMemo } from 'react';
// Импортируем типы и утилиты
import { TConstructorIngredient } from '@utils-types';
// Импортируем UI-компонент для конструктора бургера
import { BurgerConstructorUI } from '@ui';
// Импортируем действия и селекторы из Redux
import {
  getConstructorState,
  getOrderRequest,
  getOrderModalData,
  resetModal,
  setRequest,
  getOrderBurger
} from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getUserState } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

// Основной компонент конструктора бургера
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch(); // Получаем функцию dispatch для отправки действий
  const navigate = useNavigate(); // Получаем функцию навигации
  const constructorItems = useSelector(getConstructorState); // Получаем состояние конструктора из Redux

  const orderRequest = useSelector(getOrderRequest); // Получаем состояние запроса на заказ
  const orderModalData = useSelector(getOrderModalData); // Получаем данные модального окна заказа
  const isAuthenticated = useSelector(getUserState).isAuthenticated; // Проверяем, авторизован ли пользователь

  let arr: string[] = []; // Массив для хранения ID ингредиентов
  const ingredients: string[] | void = constructorItems.ingredients.map(
    (i) => i._id // Получаем ID всех ингредиентов
  );

  // Если есть булка, добавляем её в массив ингредиентов
  if (constructorItems.bun) {
    const bun = constructorItems.bun?._id; // Получаем ID булки
    arr = [bun, ...ingredients, bun]; // Формируем массив с булкой в начале и в конце
  }

  // Функция обработки клика по кнопке заказа
  const onOrderClick = () => {
    if (constructorItems.bun && isAuthenticated) {
      dispatch(setRequest(true)); // Устанавливаем состояние запроса
      dispatch(getOrderBurger(arr)); // Отправляем запрос на создание заказа
    } else if (!constructorItems.bun && isAuthenticated) {
      return; // Если нет булки, ничего не делаем
    } else if (!isAuthenticated) {
      navigate('/login'); // Если не авторизован, перенаправляем на страницу логина
    }
  };

  // Функция закрытия модального окна заказа
  const closeOrderModal = () => {
    dispatch(setRequest(false)); // Сбрасываем состояние запроса
    dispatch(resetModal()); // Сбрасываем данные модального окна
  };

  // Вычисляем общую стоимость заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // Стоимость булки (двойная)
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price, // Общая стоимость ингредиентов
        0
      ),
    [constructorItems] // Зависимость для пересчета цены
  );

  return (
    <BurgerConstructorUI
      price={price} // Передаём цену в UI
      orderRequest={orderRequest} // Передаём состояние запроса
      constructorItems={constructorItems} // Передаём элементы конструктора
      orderModalData={orderModalData} // Передаём данные модального окна
      onOrderClick={onOrderClick} // Передаём обработчик клика по заказу
      closeOrderModal={closeOrderModal} // Передаём обработчик закрытия модального окна
    />
  );
};
