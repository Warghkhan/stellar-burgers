// Импортируем стили для оверлея модального окна
import styles from './modal-overlay.module.css';

// Компонент наложения (оверлея) для модального окна
// Закрывает модальное окно при клике на затемнённую область
export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-cy='modalCloseOverlay'
  />
);
