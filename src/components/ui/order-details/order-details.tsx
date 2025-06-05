// Импортируем React для использования функциональных компонентов
import React from 'react';
// Импортируем стили для отображения деталей заказа
import styles from './order-details.module.css';
// Импортируем изображение статуса заказа
import doneImg from '../../../images/done.svg';
// Импортируем типы пропсов для компонента деталей заказа
import { OrderDetailsUIProps } from './type';

// Компонент для отображения деталей заказа
export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber // Получаем номер заказа из пропсов
}) => (
  <>
    {/* Отображение номера заказа */}
    <h2
      className={`${styles.title} text text_type_digits-large mt-2 mb-4`}
      data-cy='order-number'
    >
      {orderNumber}
    </h2>
    {/* Подпись с идентификатором заказа */}
    <p className='text text_type_main-medium'>идентификатор заказа</p>
    {/* Изображение статуса заказа */}
    <img
      className={styles.img}
      src={doneImg}
      alt='изображение статуса заказа.'
    />
    {/* Сообщение о начале приготовления заказа */}
    <p className='text text_type_main-default mb-1'>
      Ваш заказ начали готовить
    </p>
    {/* Сообщение о готовности заказа */}
    <p className={`${styles.text} text text_type_main-default`}>
      Дождитесь готовности на орбитальной станции
    </p>
  </>
);
