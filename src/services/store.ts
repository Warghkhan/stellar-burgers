// Импорт хуков из react-redux для использования в компонентах
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Импорт функций из Redux Toolkit для создания хранилища и объединения редьюсеров
import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Импорт редьюсеров слайсов приложения
import userReducer from './slices/userSlice';
import ingredientReducer from './slices/ingredientSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';

// Объединение редьюсеров в корневой редьюсер
export const rootReducer = combineReducers({
  user: userReducer,
  ingredient: ingredientReducer,
  constructorItems: constructorReducer,
  feed: feedReducer,
  order: orderReducer
});

// Создание и настройка Redux-хранилища с включением devtools в режиме разработки
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Типизация корневого состояния Redux
export type RootState = ReturnType<typeof rootReducer>;

// Типизация диспетчера Redux
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки для использования dispatch и selector с типами
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспорт сконфигурированного хранилища по умолчанию
export default store;
