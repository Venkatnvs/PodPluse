import { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout, fetchUserProfile } from '../store/actions/authActions';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, authTokens } = useSelector(state => state.auth);

  useEffect(() => {
    if (authTokens.access) {
      dispatch(fetchUserProfile());
    }
  }, [authTokens, dispatch]);

  const handleLogin = async (username, password) => {
    await dispatch(login(username, password));
  };

  const handleRegister = async (username, password) => {
    await dispatch(register(username, password));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const contextValue = {
    user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    authTokens,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
