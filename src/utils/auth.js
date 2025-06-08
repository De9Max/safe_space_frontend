
// Проверка токена аутентификации
export const isTokenValid = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    // В реальном приложении здесь может быть более сложная логика
    // проверки срока действия токена (например, проверка JWT expiration time)
    return true;
};

// Сохранение токена в localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Удаление токена из localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Функция для получения токена из localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};