import {
    GET_DEVICES,
    GET_DEVICE,
    UPDATE_DEVICE,
    DELETE_DEVICE,
    SET_CURRENT_DEVICE,
    CLEAR_CURRENT_DEVICE,
    DEVICES_ERROR
} from '../types';
import * as devicesApi from '../../api/devices';
import { setAlert, setLoading, clearLoading } from './uiActions';

// Получить все устройства простору
export const getDevices = (spaceId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await devicesApi.getDevices(spaceId);

        dispatch({
            type: GET_DEVICES,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: DEVICES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки устройств'
        });

        dispatch(setAlert('Ошибка загрузки устройств', 'error'));
        dispatch(clearLoading());
    }
};

// Получить устройство по ID
export const getDevice = (deviceId) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await devicesApi.getDevice(deviceId);

        dispatch({
            type: GET_DEVICE,
            payload: data
        });

        dispatch(clearLoading());
    } catch (err) {
        dispatch({
            type: DEVICES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка загрузки устройства'
        });

        dispatch(setAlert('Ошибка загрузки устройства', 'error'));
        dispatch(clearLoading());
    }
};

// Обновить устройство
export const updateDevice = (deviceId, deviceData) => async dispatch => {
    try {
        dispatch(setLoading());

        const data = await devicesApi.updateDevice(deviceId, deviceData);

        dispatch({
            type: UPDATE_DEVICE,
            payload: data
        });

        dispatch(setAlert('Устройство успішно обновлено', 'success'));
        dispatch(clearLoading());
        return data;
    } catch (err) {
        dispatch({
            type: DEVICES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка обновления устройства'
        });

        dispatch(setAlert('Ошибка обновления устройства', 'error'));
        dispatch(clearLoading());
        return null;
    }
};

// Видалити устройство
export const deleteDevice = (deviceId) => async dispatch => {
    try {
        dispatch(setLoading());

        await devicesApi.deleteDevice(deviceId);

        dispatch({
            type: DELETE_DEVICE,
            payload: deviceId
        });

        dispatch(setAlert('Устройство успішно удалено', 'success'));
        dispatch(clearLoading());
        return true;
    } catch (err) {
        dispatch({
            type: DEVICES_ERROR,
            payload: err.response && err.response.data ? err.response.data.detail : 'Ошибка удаления устройства'
        });

        dispatch(setAlert('Ошибка удаления устройства', 'error'));
        dispatch(clearLoading());
        return false;
    }
};

// Установить текущее устройство
export const setCurrentDevice = (device) => ({
    type: SET_CURRENT_DEVICE,
    payload: device
});

// Очистить текущее устройство
export const clearCurrentDevice = () => ({
    type: CLEAR_CURRENT_DEVICE
});

// Получить события устройства
export const getDeviceEvents = async (deviceId, params) => {
    try {
        const data = await devicesApi.getDeviceEvents(deviceId, params);
        return data;
    } catch (err) {
        console.error('Ошибка загрузки событий устройства:', err);
        return [];
    }
};