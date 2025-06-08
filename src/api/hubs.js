import api from './api';

// Get all hubs for a space
export const getHubs = async (spaceId) => {
    const response = await api.get(`/spaces/${spaceId}/hubs`);
    return response.data;
};

// Get hub by ID
export const getHub = async (hubId) => {
    const response = await api.get(`/spaces/hubs/${hubId}`);
    return response.data;
};

// Create a new hub for a space
export const createHub = async (spaceId, hubData) => {
    const response = await api.post(`/spaces/${spaceId}/hubs`, hubData);
    return response.data;
};

// Update hub
export const updateHub = async (hubId, hubData) => {
    const response = await api.put(`/spaces/hubs/${hubId}`, hubData);
    return response.data;
};

// Delete hub
export const deleteHub = async (hubId) => {
    await api.delete(`/hubs/${hubId}`);
    return hubId;
};

// Regenerate API key for a hub
export const regenerateHubApiKey = async (hubId) => {
    const response = await api.post(`/hubs/${hubId}/regenerate-api-key`);
    return response.data;
};

// Get devices connected to a hub
export const getHubDevices = async (hubId) => {
    const response = await api.get(`/hubs/${hubId}/devices`);
    return response.data;
};