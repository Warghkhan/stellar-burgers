// Импортируем тип FC для функционального компонента из React
import { FC } from 'react';
// Импортируем компоненты Button и Input из UI-библиотеки
import { Button, Input } from '@zlden/react-developer-burger-ui-components';
// Импортируем локальные стили для профиля
import styles from './profile.module.css';
// Импортируем общие стили, используемые в нескольких компонентах
import commonStyles from '../common.module.css';
// Импортируем типы пропсов для компонента профиля
import { ProfileUIProps } from './type';
// Импортируем меню профиля из компонентов
import { ProfileMenu } from '@components';

// Компонент профиля пользователя с формой для редактирования данных
export const ProfileUI: FC<ProfileUIProps> = ({
  formValue, // Значения полей формы
  isFormChanged, // Флаг изменения формы
  updateUserError, // Ошибка обновления пользователя
  handleSubmit, // Обработчик отправки формы
  handleCancel, // Обработчик отмены изменений
  handleInputChange // Обработчик изменения полей формы
}) => (
  <main className={`${commonStyles.container}`}>
    {/* Боковое меню профиля */}
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>

    {/* Форма редактирования профиля */}
    <form
      className={`mt-30 ${styles.form} ${commonStyles.form}`}
      onSubmit={handleSubmit}
    >
      <>
        {/* Поле ввода имени */}
        <div className='pb-6'>
          <Input
            type={'text'}
            placeholder={'Имя'}
            onChange={handleInputChange}
            value={formValue.name}
            name={'name'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>

        {/* Поле ввода email */}
        <div className='pb-6'>
          <Input
            type={'email'}
            placeholder={'E-mail'}
            onChange={handleInputChange}
            value={formValue.email}
            name={'email'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>

        {/* Поле ввода пароля */}
        <div className='pb-6'>
          <Input
            type={'password'}
            placeholder={'Пароль'}
            onChange={handleInputChange}
            value={formValue.password}
            name={'password'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
            autoComplete='new-password'
          />
        </div>

        {/* Кнопки "Отменить" и "Сохранить" отображаются при изменении формы */}
        {isFormChanged && (
          <div className={styles.button}>
            <Button
              type='secondary'
              htmlType='button'
              size='medium'
              onClick={handleCancel}
            >
              Отменить
            </Button>
            <Button type='primary' size='medium' htmlType='submit'>
              Сохранить
            </Button>
          </div>
        )}

        {/* Отображение ошибки обновления пользователя */}
        {updateUserError && (
          <p
            className={`${commonStyles.error} pt-5 text text_type_main-default`}
          >
            {updateUserError}
          </p>
        )}
      </>
    </form>
  </main>
);
