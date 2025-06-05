// Импортируем необходимые хуки из React
import { FC, memo } from 'react';
// Импортируем стили для модального окна
import styles from './modal.module.css';
// Импортируем иконку закрытия из UI-библиотеки
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
// Импортируем типы пропсов для модального окна
import { TModalUIProps } from './type';
// Импортируем компонент наложения модального окна
import { ModalOverlayUI } from '@ui';

// Компонент модального окна
export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className={styles.modal} data-cy='modal'>
        <div className={styles.header}>
          {/* Заголовок модального окна */}
          <h3 className={`${styles.title} text text_type_main-large`}>
            {title}
          </h3>
          {/* Кнопка закрытия модального окна */}
          <button className={styles.button} type='button' data-cy='modalClose'>
            <CloseIcon type='primary' onClick={onClose} />
          </button>
        </div>
        {/* Содержимое модального окна */}
        <div className={styles.content}>{children}</div>
      </div>
      {/* Наложение для затемнения фона при открытом модальном окне */}
      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
