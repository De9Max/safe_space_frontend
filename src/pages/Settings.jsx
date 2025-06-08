import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Switch,
    FormControlLabel,
    FormGroup
} from '@mui/material';
import {
    AccountCircle as AccountIcon,
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    Save as SaveIcon
} from '@mui/icons-material';

import { updateProfile } from '../redux/actions/authActions';

const Settings = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);

    const [tabValue, setTabValue] = useState(0);
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notifyOnIncident: true,
        notifyOnDeviceOffline: true,
        notifyOnLowBattery: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Инициализация данных профиля
    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });

        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }

        // Сбрасываем состояние успішного сохранения
        if (saveSuccess) {
            setSaveSuccess(false);
        }
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings({
            ...notificationSettings,
            [name]: checked
        });

        // Сбрасываем состояние успішного сохранения
        if (saveSuccess) {
            setSaveSuccess(false);
        }
    };

    const validateProfileForm = () => {
        const errors = {};
        if (!profileData.email) {
            errors.email = 'Email обовязковий для заповення';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            errors.email = 'Некорректный формат email';
        }

        if (!profileData.first_name) {
            errors.first_name = 'Імя обовязкове для заповення';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (validateProfileForm()) {
            const result = await dispatch(updateProfile(profileData));
            if (result) {
                setSaveSuccess(true);

                // Скрываем сообщение об успехе через 3 секунды
                setTimeout(() => {
                    setSaveSuccess(false);
                }, 3000);
            }
        }
    };

    const handleSaveNotifications = () => {
        // В реальном приложении здесь будет вызов API для сохранения настроек повідомлень
        console.log('Налаштування повідомлень:', notificationSettings);
        setSaveSuccess(true);

        // Скрываем сообщение об успехе через 3 секунды
        setTimeout(() => {
            setSaveSuccess(false);
        }, 3000);
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Налаштування
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
                    <Tab
                        icon={<AccountIcon />}
                        iconPosition="start"
                        label="Профіль"
                        id="tab-0"
                    />
                    <Tab
                        icon={<NotificationsIcon />}
                        iconPosition="start"
                        label="Повідомлення"
                        id="tab-1"
                    />
                    <Tab
                        icon={<SecurityIcon />}
                        iconPosition="start"
                        label="Безпека"
                        id="tab-2"
                    />
                </Tabs>
            </Box>

            {/* Профиль */}
            {tabValue === 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            Особиста інформація
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {saveSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Профіль успішно оновлено
                            </Alert>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="first_name"
                                    name="first_name"
                                    label="Ім'я"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    error={!!formErrors.first_name}
                                    helperText={formErrors.first_name}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    label="Прізвище"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    error={!!formErrors.last_name}
                                    helperText={formErrors.last_name}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    label="Телефон"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Зберегти'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Повідомлення */}
            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            Налаштування повідомлень
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {saveSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Налаштування повідомлень успішно збережені
                            </Alert>
                        )}

                        <Typography variant="subtitle1" gutterBottom>
                            Канали повідомлень
                        </Typography>
                        <FormGroup sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.emailNotifications}
                                        onChange={handleNotificationChange}
                                        name="emailNotifications"
                                    />
                                }
                                label="Повідомлення по email"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.smsNotifications}
                                        onChange={handleNotificationChange}
                                        name="smsNotifications"
                                    />
                                }
                                label="SMS-Повідомлення"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.pushNotifications}
                                        onChange={handleNotificationChange}
                                        name="pushNotifications"
                                    />
                                }
                                label="Push-Повідомлення"
                            />
                        </FormGroup>

                        <Typography variant="subtitle1" gutterBottom>
                            Типи повідомлень
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.notifyOnIncident}
                                        onChange={handleNotificationChange}
                                        name="notifyOnIncident"
                                    />
                                }
                                label="Повідомляти об інцидентах"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.notifyOnDeviceOffline}
                                        onChange={handleNotificationChange}
                                        name="notifyOnDeviceOffline"
                                    />
                                }
                                label="Повідомляти об відключенні пристроїв"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.notifyOnLowBattery}
                                        onChange={handleNotificationChange}
                                        name="notifyOnLowBattery"
                                    />
                                }
                                label="Повідомляти о низком заряді батареи"
                            />
                        </FormGroup>

                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveNotifications}
                            >
                                Зберегти
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Безопасность */}
            {tabValue === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            Налаштування безопасности
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="subtitle1" gutterBottom>
                            Змінити пароль
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="current-password"
                                    name="currentPassword"
                                    label="Текущий пароль"
                                    type="password"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="new-password"
                                    name="newPassword"
                                    label="Новий пароль"
                                    type="password"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="confirm-password"
                                    name="confirmPassword"
                                    label="Підтвердіть новий пароль"
                                    type="password"
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                            >
                                Змінити пароль
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default Settings;