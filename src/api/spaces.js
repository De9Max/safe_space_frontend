import api from './api';

// Получить все простору пользователя
export const getSpaces = async () => {
    const response = await api.get('/spaces');
    return response.data;
};

// Получить конкретное простір по ID
export const getSpace = async (spaceId) => {
    const response = await api.get(`/spaces/${spaceId}`);
    return response.data;
};

// Створити новий простір
export const createSpace = async (spaceData) => {
    const response = await api.post('/spaces', spaceData);
    return response.data;
};

// Обновить существующее простір
export const updateSpace = async (spaceId, spaceData) => {
    const response = await api.put(`/spaces/${spaceId}`, spaceData);
    return response.data;
};

// Видалити простір
export const deleteSpace = async (spaceId) => {
    await api.delete(`/spaces/${spaceId}`);
    return spaceId;
};

// Получить хабы простору
export const getSpaceHubs = async (spaceId) => {
    const response = await api.get(`/spaces/${spaceId}/hubs`);
    return response.data;
};

// Створити новый хаб в пространстве
export const createHub = async (spaceId, hubData) => {
    const response = await api.post(`/spaces/${spaceId}/hubs`, hubData);
    return response.data;
};

// Регенерировать API-ключ для хаба
export const regenerateHubApiKey = async (hubId) => {
    const response = await api.post(`/hubs/${hubId}/regenerate-api-key`);
    return response.data;
};