import Cookies from 'js-cookie';
import { loginApi, registerApi, refreshTokenApi, fetchUserApi } from '../../apis/authentication';
import { AUTH_FAIL, FETCH_USER_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS, SET_USER } from '@/constants/actions/AuthConstants';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/CookiesConstants';

export const loginSuccess = (authTokens) => ({
    type: LOGIN_SUCCESS,
    payload: authTokens,
});

export const registerSuccess = () => ({
    type: REGISTER_SUCCESS,
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const setUserFail = (error) => ({
    type: FETCH_USER_FAIL,
    payload: error,
});

export const authFail = (error) => ({
    type: AUTH_FAIL,
    payload: error,
});

export const logout = () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
    return {
        type: LOGOUT,
    };
};

export const loginUser = (formData) => async (dispatch) => {
    try {
        const response = await loginApi(formData);
        Cookies.set(ACCESS_TOKEN, response.data.tokens.access);
        Cookies.set(REFRESH_TOKEN, response.data.tokens.refresh);
        dispatch(loginSuccess(response.data.tokens));
        dispatch(setUser(response.data.email));
    } catch (error) {
        dispatch(authFail(error.response.data));
    }
};

export const registerUser = (formData) => async (dispatch) => {
    try {
        await registerApi(formData);
        dispatch(registerSuccess());
    } catch (error) {
        dispatch(authFail(error.response.data));
    }
};

export const refreshToken = () => async (dispatch) => {
    try {
        const refreshToken = Cookies.get(REFRESH_TOKEN);
        const response = await refreshTokenApi(refreshToken);
        Cookies.set(ACCESS_TOKEN, response.data.access);
        Cookies.set(REFRESH_TOKEN, response.data.refresh);
        dispatch(loginSuccess(response.data));
    } catch (error) {
        dispatch(logout());
    }
};

export const fetchUser = () => async (dispatch) => {
    try {
        const response = await fetchUserApi();
        dispatch(setUser(response.data));
    } catch (error) {
        dispatch(setUserFail(error.response.data));
    }
};