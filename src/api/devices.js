import api from './api';

// Получить все устройства в пространстве
export const getDevices = async (spaceId, params = {}) => {
    const response = await api.get(`/spaces/${spaceId}/devices`, { params });
    return response.data;
};

// Получить конкретное устройство по ID
export const getDevice = async (deviceId) => {
    const response = await api.get(`spaces/devices/${deviceId}`);
    return response.data;
};

// Створити новий устройство в пространстве
export const createDevice = async (spaceId, deviceData) => {
    const response = await api.post(`/spaces/${spaceId}/devices`, deviceData);
    return response.data;
};

// Обновить существующее устройство
export const updateDevice = async (deviceId, deviceData) => {
    const response = await api.put(`/devices/${deviceId}`, deviceData);
    return response.data;
};

// Видалити устройство
export const deleteDevice = async (deviceId) => {
    await api.delete(`/devices/${deviceId}`);
    return deviceId;
};

// Получить события устройства
export const getDeviceEvents = async (deviceId, params = {}) => {
    const response = await api.get(`spaces/devices/${deviceId}/events`, { params });
    return response.data;
};