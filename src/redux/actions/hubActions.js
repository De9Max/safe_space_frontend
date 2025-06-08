import {
    GET_HUBS,
    GET_HUB,
    ADD_HUB,
    UPDATE_HUB,
    DELETE_HUB,
    SET_CURRENT_HUB,
    CLEAR_CURRENT_HUB,
    HUBS_ERROR,
    REGENERATE_HUB_API_KEY
} from '../types';
import * as hubsApi from '../../api/hubs';
import { setAlert, setLoading, clearLoading } from './uiActions';

// Get all hubs for a space
export const getHubs = (spaceId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await hubsApi.getHubs(spaceId);

        dispatch({
            type: GET_HUBS,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки хабов'
        });

        dispatch(setAlert('Ошибка загрузки хабов', 'error'));
        dispatch(clearLoading());
    }
};

// Get hub by ID
export const getHub = (hubId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await hubsApi.getHub(hubId);

        dispatch({
            type: GET_HUB,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки хаба'
        });

        dispatch(setAlert('Ошибка загрузки хаба', 'error'));
        dispatch(clearLoading());
    }
};

// Create a new hub
export const createHub = (spaceId, hubData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await hubsApi.createHub(spaceId, hubData);

        dispatch({
            type: ADD_HUB,
            payload: data
        });

        dispatch(setAlert('Хаб успішно создан', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка создания хаба'
        });

        dispatch(setAlert('Ошибка создания хаба', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Update hub
export const updateHub = (hubId, hubData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await hubsApi.updateHub(hubId, hubData);

        dispatch({
            type: UPDATE_HUB,
            payload: data
        });

        dispatch(setAlert('Хаб успішно оновлен', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка обновления хаба'
        });

        dispatch(setAlert('Ошибка обновления хаба', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Delete hub
export const deleteHub = (hubId) => async dispatch => {
    try {
        dispatch(setLoading());

        await hubsApi.deleteHub(hubId);

        dispatch({
            type: DELETE_HUB,
            payload: hubId
        });

        dispatch(setAlert('Хаб успішно удален', 'success'));
        dispatch(clearLoading());
        return true;
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка удаления хаба'
        });

        dispatch(setAlert('Ошибка удаления хаба', 'error'));
        dispatch(clearLoading());
        return false;
    }
};

// Set current hub
export const setCurrentHub = (hub) => ({
    type: SET_CURRENT_HUB,
    payload: hub
});

// Clear current hub
export const clearCurrentHub = () => ({
    type: CLEAR_CURRENT_HUB
});

// Regenerate hub API key
export const regenerateHubApiKey = (hubId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await hubsApi.regenerateHubApiKey(hubId);

        dispatch({
            type: REGENERATE_HUB_API_KEY,
            payload: {
                id: hubId,
                api_key: data.api_key
            }
        });

        dispatch(setAlert('API-ключ успішно обновлен', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: HUBS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка обновления API-ключа'
        });

        dispatch(setAlert('Ошибка обновления API-ключа', 'error'));
        dispatch(clearLoading());
        return null;
    }
};