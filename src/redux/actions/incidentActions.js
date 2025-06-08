import {
    GET_INCIDENTS,
    GET_INCIDENT,
    UPDATE_INCIDENT,
    INCIDENTS_ERROR,
    CLEAR_INCIDENTS
} from '../types';
import * as incidentsApi from '../../api/incidents';
import { setAlert, setLoading, clearLoading } from './uiActions';

// Получить все инциденты простору
export const getIncidents = (spaceId, params = {}) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await incidentsApi.getIncidents(spaceId, params);

        dispatch({
            type: GET_INCIDENTS,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: INCIDENTS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки инцидентов'
        });

        dispatch(setAlert('Ошибка загрузки инцидентов', 'error'));
        dispatch(clearLoading());
    }
};

// Получить инцидент по ID
export const getIncident = (incidentId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await incidentsApi.getIncident(incidentId);

        dispatch({
            type: GET_INCIDENT,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: INCIDENTS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки инцидента'
        });

        dispatch(setAlert('Ошибка загрузки инцидента', 'error'));
        dispatch(clearLoading());
    }
};

// Обновить статус инцидента
export const updateIncidentStatus = (incidentId, statusData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await incidentsApi.updateIncidentStatus(incidentId, statusData);

        dispatch({
            type: UPDATE_INCIDENT,
            payload: data
        });

        dispatch(setAlert('Статус инцидента обновлен', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: INCIDENTS_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка обновления статуса инцидента'
        });

        dispatch(setAlert('Ошибка обновления статуса инцидента', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Получить все события простору
export const getEvents = async (spaceId, params = {}) => {
    try {
        const data = await incidentsApi.getEvents(spaceId, params);
        return data;
    } catch (err) {
        console.error('Ошибка загрузки событий:', err);
        return [];
    }
};

// Очистить инциденты
export const clearIncidents = () => ({
    type: CLEAR_INCIDENTS
});