import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT,
    USER_LOADED,
    AUTH_ERROR,
    CLEAR_ERRORS
} from '../types';
import * as authApi from '../../api/auth';
import { setAlert } from './uiActions';

// Логин пользователя
export const login = (email, password) => async dispatch => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const data = await authApi.login(email, password);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        });

        dispatch(loadUser());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка входа'
        });

        dispatch(setAlert('Ошибка авторизации', 'error'));
    }
};

// Загрузка пользователя
export const loadUser = () => async dispatch => {
    try {
        const data = await authApi.getCurrentUser();

        dispatch({
            type: USER_LOADED,
            payload: data
        });
    } catch (err) {
        dispatch({ type: AUTH_ERROR });
    }
};

// Проверка статуса аутентификации
export const checkAuthStatus = () => async dispatch => {
    const token = localStorage.getItem('token');

    if (!token) {
        dispatch({ type: AUTH_ERROR });
        return;
    }

    try {
        dispatch(loadUser());
    } catch (err) {
        dispatch({ type: AUTH_ERROR });
    }
};

// Регистрация пользователя
export const register = (userData) => async dispatch => {
    try {
        dispatch({ type: REGISTER_REQUEST });

        const data = await authApi.register(userData);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: { user: data }
        });

        dispatch(setAlert('Регистрация успешна! Теперь вы можете войти в систему.', 'success'));
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка регистрации'
        });

        dispatch(setAlert('Ошибка регистрации', 'error'));
    }
};

// Обновление профиля пользователя
export const updateProfile = (userData) => async dispatch => {
    try {
        const data = await authApi.updateUser(userData);

        dispatch({
            type: USER_LOADED,
            payload: data
        });

        dispatch(setAlert('Профиль успішно обновлен', 'success'));
        return true;
    } catch (err) {
        dispatch(setAlert('Ошибка обновления профиля', 'error'));
        return false;
    }
};

// Выход из системы
export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};

// Очистка ошибок
export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
};