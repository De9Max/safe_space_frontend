import api from './api';

// Логин пользователя
export const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response.data;
};

// Регистрация пользователя
export const register = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

// Получение данных текущего пользователя
export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

// Обновление данных пользователя
export const updateUser = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};