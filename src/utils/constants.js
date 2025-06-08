
// Типи пространств
export const SpaceType = {
    HOME: 'Будинок',
    APARTMENT: 'Квартира',
    OFFICE: 'Офіс',
    WAREHOUSE: 'Склад',
    OTHER: 'Інше'
};

// Типи устройств
export const DeviceType = {
    'camera': 'Камера',
    'motion_sensor': 'Датчик руху',
    'door_sensor': 'Датчик відкриття дверей',
    'window_sensor': 'Датчик відкриття окна',
    'smoke_detector': 'Датчик диму',
    'water_leak_sensor': 'Датчик протікання води',
    'temperature_sensor': 'Датчик температури',
    'humidity_sensor': 'Датчик вологи',
    'air_quality_sensor': 'Датчик качества повітря',
    'other': 'Інше'
};

// Статусы инцидентов
export const IncidentStatus = {
    NEW: 'Новий',
    ACKNOWLEDGED: 'Оброблений',
    RESOLVED: 'Вирішений',
    FALSE_ALARM: 'Хибна тривога'
};

// Уровни важности инцидентов
export const IncidentSeverity = {
    LOW: 'Низький',
    MEDIUM: 'Середній',
    HIGH: 'Високий',
    CRITICAL: 'Критичний'
};

// Типи событий
export const EventType = {
    MOTION_DETECTED: 'Обнаружено движение',
    DOOR_OPENED: 'Дверь открыта',
    WINDOW_OPENED: 'Окно открыто',
    SMOKE_DETECTED: 'Обнаружен дым',
    WATER_LEAK_DETECTED: 'Обнаружена протечка воды',
    HIGH_TEMPERATURE: 'Высокая температура',
    LOW_TEMPERATURE: 'Низкая температура',
    HIGH_HUMIDITY: 'Высокая влажность',
    LOW_HUMIDITY: 'Низкая влажность',
    POOR_AIR_QUALITY: 'Плохое качество воздуха',
    DEVICE_OFFLINE: 'Устройство не в сети',
    DEVICE_ONLINE: 'Устройство в сети',
    OTHER: 'Другое'
};

// Форматирование даты
export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Получение цвета для уровня важности инцидента
export const getSeverityColor = (severity) => {
    switch (severity) {
        case 'LOW':
            return 'info';
        case 'MEDIUM':
            return 'warning';
        case 'HIGH':
        case 'CRITICAL':
            return 'error';
        default:
            return 'default';
    }
};

// Форматирование числа (например, для уровня заряда батареи)
export const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined) return '';

    return Number(value).toFixed(decimals);
};