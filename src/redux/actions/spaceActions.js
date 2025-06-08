import {
    GET_SPACES,
    GET_SPACE,
    ADD_SPACE,
    UPDATE_SPACE,
    DELETE_SPACE,
    SET_CURRENT_SPACE,
    CLEAR_CURRENT_SPACE,
    SPACES_ERROR
} from '../types';
import * as spacesApi from '../../api/spaces';
import { setAlert, setLoading, clearLoading } from './uiActions';

// Получить все простору
export const getSpaces = () => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await spacesApi.getSpaces();

        dispatch({
            type: GET_SPACES,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: SPACES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки пространств'
        });

        dispatch(setAlert('Ошибка загрузки пространств', 'error'));
        dispatch(clearLoading());
    }
};

// Получить простір по ID
export const getSpace = (spaceId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await spacesApi.getSpace(spaceId);

        dispatch({
            type: GET_SPACE,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: SPACES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки простору'
        });

        dispatch(setAlert('Ошибка загрузки простору', 'error'));
        dispatch(clearLoading());
    }
};

// Створити новий простір
export const createSpace = (spaceData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await spacesApi.createSpace(spaceData);

        dispatch({
            type: ADD_SPACE,
            payload: data
        });

        dispatch(setAlert('Пространство успішно создано', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: SPACES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка создания простору'
        });

        dispatch(setAlert('Ошибка создания простору', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Обновить простір
export const updateSpace = (spaceId, spaceData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await spacesApi.updateSpace(spaceId, spaceData);

        dispatch({
            type: UPDATE_SPACE,
            payload: data
        });

        dispatch(setAlert('Пространство успішно обновлено', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: SPACES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка обновления простору'
        });

        dispatch(setAlert('Ошибка обновления простору', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Видалити простір
export const deleteSpace = (spaceId) => async dispatch => {
    try {
        dispatch(setLoading());

        await spacesApi.deleteSpace(spaceId);

        dispatch({
            type: DELETE_SPACE,
            payload: spaceId
        });

        dispatch(setAlert('Пространство успішно удалено', 'success'));
        dispatch(clearLoading());
        return true;
    } catch (err) {
        dispatch({
            type: SPACES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка удаления простору'
        });

        dispatch(setAlert('Ошибка удаления простору', 'error'));
        dispatch(clearLoading());
        return false;
    }
};

// Установить текущее простір
export const setCurrentSpace = (space) => ({
    type: SET_CURRENT_SPACE,
    payload: space
});

// Очистить текущее простір
export const clearCurrentSpace = () => ({
    type: CLEAR_CURRENT_SPACE
});

// Получить хабы для простору
export const getSpaceHubs = async (spaceId) => {
    try {
        const data = await spacesApi.getSpaceHubs(spaceId);
        return data;
    } catch (err) {
        console.error('Ошибка загрузки хабов:', err);
        return [];
    }
};

// Створити новый хаб
export const createHub = async (spaceId, hubData) => {
    try {
        const data = await spacesApi.createHub(spaceId, hubData);
        return data;
    } catch (err) {
        console.error('Ошибка создания хаба:', err);
        return null;
    }
};

// Регенерировать API-ключ для хаба
export const regenerateHubApiKey = async (hubId) => {
    try {
        const data = await spacesApi.regenerateHubApiKey(hubId);
        return data;
    } catch (err) {
        console.error('Ошибка регенерации API-ключа:', err);
        return null;
    }
};