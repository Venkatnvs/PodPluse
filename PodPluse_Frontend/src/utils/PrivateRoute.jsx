import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const authTokens = useSelector(state => state.auth.authTokens);
  return (
    (authTokens.access && authTokens.refresh) ?  <Outlet /> : <Navigate to="/login" replace={true} />
  );
};

export default PrivateRoute;
