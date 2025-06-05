// Импортируем необходимые компоненты и хуки из React Router
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// Импортируем хук useSelector для доступа к состоянию Redux
import { useSelector } from '../../services/store';
// Импортируем компонент прелоадера для отображения загрузки
import { Preloader } from '../ui/preloader';
// Импортируем селектор для получения состояния пользователя
import { getUserState } from '../../services/slices/userSlice';

// Тип для пропсов защищенного маршрута
type ProtectedRouteProps = {
  children: React.ReactElement; // Дочерние элементы, которые будут рендериться
  onlyAuthorized?: boolean; // Флаг для ограничения доступа только авторизованным пользователям
};

// Компонент защищенного маршрута
export const ProtectedRoute = ({
  children,
  onlyAuthorized
}: ProtectedRouteProps) => {
  const location = useLocation(); // Получаем текущую локацию

  // Получаем состояние проверки аутентификации и статус пользователя из Redux
  const { isAuthChecked, isAuthenticated } = useSelector(getUserState);

  // Если проверка аутентификации еще не завершена, показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если доступ не ограничен, но пользователь не аутентифицирован, перенаправляем на страницу логина
  if (!onlyAuthorized && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если доступ ограничен и пользователь аутентифицирован, перенаправляем на предыдущую страницу
  if (onlyAuthorized && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' }; // Получаем предыдущий путь или устанавливаем корневой
    return <Navigate replace to={from} />;
  }

  // Если нет дочерних элементов, рендерим Outlet для вложенных маршрутов
  return children ? children : <Outlet />;
};
