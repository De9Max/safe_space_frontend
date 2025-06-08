import {
    SET_LOADING,
    CLEAR_LOADING,
    SET_ALERT,
    CLEAR_ALERT
} from '../types';

// Установить состояние загрузки
export const setLoading = () => ({
    type: SET_LOADING
});

// Очистить состояние загрузки
export const clearLoading = () => ({
    type: CLEAR_LOADING
});

// Показать уведомление (алерт)
export const setAlert = (message, severity = 'info', timeout = 5000) => dispatch => {
    const id = Date.now();

    dispatch({
        type: SET_ALERT,
        payload: { id, message, severity }
    });

    setTimeout(() => dispatch({ type: CLEAR_ALERT }), timeout);
};

// Очистить уведомление
export const clearAlert = () => ({
    type: CLEAR_ALERT
});