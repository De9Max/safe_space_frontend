import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Grid,
    CircularProgress,
    Alert,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    History as HistoryIcon,
    BatteryFull as BatteryFullIcon,
    BatteryAlert as BatteryAlertIcon,
    BatteryChargingFull as BatteryIcon,
    SignalWifi4Bar as SignalIcon,
    SignalWifiOff as SignalOffIcon
} from '@mui/icons-material';

import { getDevice, updateDevice, deleteDevice, getDeviceEvents } from '../redux/actions/deviceActions';
import { DeviceType } from '../utils/constants';

// Вспомогательная функция для отображения уровня заряда батареи
const BatteryIndicator = ({ level }) => {
    if (level === null || level === undefined) return null;

    const percentage = Math.round(level * 100);
    let icon;
    let color;

    if (percentage < 20) {
        icon = <BatteryAlertIcon />;
        color = 'error';
    } else {
        icon = <BatteryFullIcon />;
        color = 'success';
    }

    return (
        <Chip
            icon={icon}
            label={`${percentage}%`}
            size="small"
            color={color}
            variant="outlined"
        />
    );
};

// Компонент отображения событий устройства
const EventsTab = ({ deviceEvents, loading }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Історія івентів
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : deviceEvents.length === 0 ? (
                <Alert severity="info">
                    Історія івентів пуста
                </Alert>
            ) : (
                <List>
                    {deviceEvents.map((event) => (
                        <ListItem key={event.id}>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={event.type.replace(/_/g, ' ')}
                                secondary={new Date(event.created_at).toLocaleString()}
                            />
                            <ListItemText
                                primary={event.data ? JSON.stringify(event.data, null, 2) : "Нет данных"}
                                sx={{
                                    maxWidth: '50%',
                                    '& .MuiListItemText-primary': {
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word'
                                    }
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

// Компонент страницы устройства
const DevicePage = () => {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentDevice, loading } = useSelector(state => state.devices);

    const [tabValue, setTabValue] = useState(0);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deviceData, setDeviceData] = useState({
        name: '',
        location: '',
        is_active: true
    });
    const [deviceEvents, setDeviceEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Загрузка данных устройства при монтировании компонента
    useEffect(() => {
        if (deviceId) {
            dispatch(getDevice(parseInt(deviceId)));
            loadDeviceEvents();
        }
    }, [dispatch, deviceId]);

    // Обновление формы редактирования при изменении данных устройства
    useEffect(() => {
        if (currentDevice) {
            setDeviceData({
                name: currentDevice.name || '',
                location: currentDevice.location || '',
                is_active: currentDevice.is_active !== false
            });
        }
    }, [currentDevice]);

    // Загрузка событий устройства
    const loadDeviceEvents = async () => {
        setEventsLoading(true);
        try {
            const events = await getDeviceEvents(parseInt(deviceId), { limit: 20 });
            setDeviceEvents(events || []);
        } catch (error) {
            console.error('Error loading device events:', error);
            setDeviceEvents([]);
        } finally {
            setEventsLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        dispatch(getDevice(parseInt(deviceId)));
        loadDeviceEvents();
    };

    // Обработчики для диалога редактирования устройства
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setFormErrors({});
    };

    const handleDeviceInputChange = (e) => {
        const { name, value, checked } = e.target;
        setDeviceData({
            ...deviceData,
            [name]: name === 'is_active' ? checked : value
        });

        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const validateDeviceForm = () => {
        const errors = {};
        if (!deviceData.name) {
            errors.name = 'Название устройства обязательно';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateDevice = async () => {
        if (validateDeviceForm()) {
            const result = await dispatch(updateDevice(parseInt(deviceId), deviceData));
            if (result) {
                handleCloseEditDialog();
            }
        }
    };

    // Обработчики для диалога удаления устройства
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteDevice = async () => {
        const result = await dispatch(deleteDevice(parseInt(deviceId)));
        if (result) {
            handleCloseDeleteDialog();
            // Навигация назад к пространству
            if (currentDevice && currentDevice.space_id) {
                navigate(`/spaces/${currentDevice.space_id}`);
            } else {
                navigate('/dashboard');
            }
        }
    };

    if (loading && !currentDevice) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentDevice) {
        return (
            <Alert severity="error">
                Устройство не найдено. Возможно, оно было удалено или у вас нет к нему доступа.
            </Alert>
        );
    }

    return (
        <Box>
            {/* Заголовок и меню действий */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={3}
                flexWrap="wrap"
            >
                <Box>
                    <Typography variant="h4" component="h1">
                        {currentDevice.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {DeviceType[currentDevice.type] || currentDevice.type}
                        {currentDevice.location && ` • ${currentDevice.location}`}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center" mt={1}>
                        <Chip
                            icon={currentDevice.is_active ? <SignalIcon /> : <SignalOffIcon />}
                            label={currentDevice.is_active ? 'Онлайн' : 'Офлайн'}
                            color={currentDevice.is_active ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                        />
                        {currentDevice.battery_level !== null && (
                            <BatteryIndicator level={currentDevice.battery_level} />
                        )}
                        {currentDevice.last_seen && (
                            <Typography variant="caption" color="text.secondary">
                                Остання активність: {new Date(currentDevice.last_seen).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box display="flex" gap={1}>
                    <IconButton onClick={handleRefresh} color="primary" title="Обновить">
                        <RefreshIcon />
                    </IconButton>
                    <IconButton onClick={handleOpenEditDialog} color="primary" title="Редагувати">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleOpenDeleteDialog} color="error" title="Видалити">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Информация об устройстве */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Основна інформація
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Тип пристрою
                                    </Typography>
                                    <Typography variant="body1">
                                        {DeviceType[currentDevice.type] || currentDevice.type}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Локація
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentDevice.location || 'Не вказано'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Статус
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentDevice.is_active ? 'Активно' : 'Неактивно'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Підключено
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(currentDevice.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                {currentDevice.zigbee_id && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Zigbee ID
                                        </Typography>
                                        <Typography variant="body1">
                                            {currentDevice.zigbee_id}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Технічні характеристики
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                {currentDevice.battery_level !== null && (
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Рівень заряду
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <BatteryIcon color={currentDevice.battery_level < 20 ? 'error' : 'success'} />
                                            <Typography variant="body1" sx={{ ml: 1 }}>
                                                {Math.round(currentDevice.battery_level)}%
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {currentDevice.last_seen && (
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Остання активність
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(currentDevice.last_seen).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                )}
                                {currentDevice.hub_id && (
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Hub ID
                                        </Typography>
                                        <Typography variant="body1">
                                            {currentDevice.hub_id}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Вкладки */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="device tabs">
                    <Tab
                        icon={<HistoryIcon />}
                        iconPosition="start"
                        label="Івенти"
                        id="tab-0"
                    />
                </Tabs>
            </Box>

            {/* Содержимое вкладок */}
            <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                    <EventsTab
                        deviceEvents={deviceEvents}
                        loading={eventsLoading}
                    />
                )}
            </Box>

            {/* Диалог редактирования устройства */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Редагувати устройство</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Назва пристрою"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={deviceData.name}
                        onChange={handleDeviceInputChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="location"
                        name="location"
                        label="Расположение устройства"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={deviceData.location}
                        onChange={handleDeviceInputChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={deviceData.is_active}
                                onChange={handleDeviceInputChange}
                                name="is_active"
                                color="primary"
                            />
                        }
                        label="Устройство активно"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Скасувати</Button>
                    <Button onClick={handleUpdateDevice} variant="contained">Зберегти</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог удаления устройства */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Видалити устройство</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить устройство "{currentDevice.name}"? Это действие нельзя отменить.
                        Вся история событий этого устройства также будет удалена.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Скасувати</Button>
                    <Button onClick={handleDeleteDevice} color="error" variant="contained">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DevicePage;