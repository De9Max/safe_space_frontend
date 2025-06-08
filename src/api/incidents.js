import api from './api';

// Получить все инциденты в пространстве
export const getIncidents = async (spaceId, params = {}) => {
    const response = await api.get(`/spaces/${spaceId}/incidents`, { params });
    return response.data;
};

// Получить конкретный инцидент по ID
export const getIncident = async (incidentId) => {
    const response = await api.get(`/incidents/${incidentId}`);
    return response.data;
};

// Обновить статус инцидента
export const updateIncidentStatus = async (incidentId, statusData) => {
    const response = await api.put(`/incidents/${incidentId}`, statusData);
    return response.data;
};

// Получить все события в пространстве
export const getEvents = async (spaceId, params = {}) => {
    const response = await api.get(`/spaces/${spaceId}/events`, { params });
    return response.data;
};