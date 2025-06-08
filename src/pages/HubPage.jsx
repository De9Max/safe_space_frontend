import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
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
    IconButton,
    Tab,
    Tabs,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    ContentCopy as CopyIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    DevicesOther as DevicesIcon,
    SignalWifi4Bar as SignalIcon,
    SignalWifiOff as SignalOffIcon
} from '@mui/icons-material';

import { getHub, updateHub, deleteHub, regenerateHubApiKey } from '../redux/actions/hubActions';
import { getDevices } from '../redux/actions/deviceActions';
import DeviceList from '../components/devices/DeviceList';
import HubForm from '../components/hubs/HubForm';

const HubPage = () => {
    const { hubId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentHub, loading: hubLoading } = useSelector(state => state.hubs);
    const { devices, loading: devicesLoading } = useSelector(state => state.devices);

    const [tabValue, setTabValue] = useState(0);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openApiKeyDialog, setOpenApiKeyDialog] = useState(false);
    const [openRegenerateDialog, setOpenRegenerateDialog] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Load hub data when component mounts
    useEffect(() => {
        if (hubId) {
            dispatch(getHub(parseInt(hubId)));
            // Get devices connected to this hub
            if (currentHub && currentHub.space_id) {
                dispatch(getDevices(currentHub.space_id, { hub_id: parseInt(hubId) }));
            }
        }
    }, [dispatch, hubId, currentHub?.space_id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        dispatch(getHub(parseInt(hubId)));
        if (currentHub && currentHub.space_id) {
            dispatch(getDevices(currentHub.space_id, { hub_id: parseInt(hubId) }));
        }
    };

    // Edit hub handlers
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleUpdateHub = async (hubData) => {
        const result = await dispatch(updateHub(parseInt(hubId), hubData));
        if (result) {
            handleCloseEditDialog();
        }
    };

    // Delete hub handlers
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteHub = async () => {
        const result = await dispatch(deleteHub(parseInt(hubId)));
        if (result) {
            handleCloseDeleteDialog();
            // Navigate back to space page
            if (currentHub && currentHub.space_id) {
                navigate(`/spaces/${currentHub.space_id}`);
            } else {
                navigate('/dashboard');
            }
        }
    };

    // API Key handlers
    const handleOpenApiKeyDialog = () => {
        setOpenApiKeyDialog(true);
    };

    const handleCloseApiKeyDialog = () => {
        setOpenApiKeyDialog(false);
        setShowApiKey(false);
    };

    const handleOpenRegenerateDialog = () => {
        setOpenRegenerateDialog(true);
    };

    const handleCloseRegenerateDialog = () => {
        setOpenRegenerateDialog(false);
    };

    const handleToggleApiKeyVisibility = () => {
        setShowApiKey(!showApiKey);
    };

    const handleCopyApiKey = () => {
        if (currentHub && currentHub.api_key) {
            navigator.clipboard.writeText(currentHub.api_key);
            setCopySuccess(true);

            // Reset copy success message after 2 seconds
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        }
    };

    const handleRegenerateApiKey = async () => {
        await dispatch(regenerateHubApiKey(parseInt(hubId)));
        setOpenRegenerateDialog(false);
    };

    const handleDeviceClick = (deviceId) => {
        navigate(`/devices/${deviceId}`);
    };

    if (hubLoading && !currentHub) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentHub) {
        return (
            <Alert severity="error">
                Хаб не знайден. Можливо, він був видалений або у вас немає доступу до нього.
            </Alert>
        );
    }

    return (
        <Box>
            {/* Header and action menu */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexWrap="wrap"
            >
                <Box>
                    <Typography variant="h4" component="h1">
                        {currentHub.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {currentHub.model && `Модель: ${currentHub.model}`}
                        {currentHub.location && ` • ${currentHub.location}`}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center" mt={1}>
                        <Chip
                            icon={currentHub.is_active ? <SignalIcon /> : <SignalOffIcon />}
                            label={currentHub.is_active ? 'Онлайн' : 'Оффлайн'}
                            color={currentHub.is_active ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                        />
                        {currentHub.last_seen && (
                            <Typography variant="caption" color="text.secondary">
                                Остання активність: {new Date(currentHub.last_seen).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box display="flex" gap={1}>
                    <IconButton onClick={handleRefresh} color="primary" title="Оновити">
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

            {/* Hub info and API key */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Інформація про хаб
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Модель
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentHub.model || 'Не вказано'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Локація
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentHub.location || 'Не вказано'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Статус
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentHub.is_active ? 'Онлайн' : 'Оффлайн'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Створений
                                    </Typography>
                                    <Typography variant="body1">
                                        {currentHub.created_at && new Date(currentHub.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        API-ключ
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleOpenApiKeyDialog}
                                        >
                                            Показати API-ключ
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Під'єднані пристрої
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {devices && (
                                <Typography variant="body1">
                                    Всього пристроїв: {devices.length}
                                </Typography>
                            )}

                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setTabValue(0)}
                                >
                                    Переглянути всі пристрої
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="hub tabs">
                    <Tab
                        icon={<DevicesIcon />}
                        iconPosition="start"
                        label="Пристрої"
                        id="tab-0"
                    />
                </Tabs>
            </Box>

            {/* Tab content */}
            <Box sx={{ mt: 2 }}>
                {/* Devices Tab */}
                {tabValue === 0 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Устройства</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Пристрої підключаються автоматично
                            </Typography>
                        </Box>

                        {devicesLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : devices && devices.length > 0 ? (
                            <DeviceList
                                devices={devices}
                                loading={devicesLoading}
                                onDeviceClick={handleDeviceClick}
                            />
                        ) : (
                            <Alert severity="info">
                                До цього хаба ще не підключено пристроїв. Пристрої відображаються автоматично після їх підключення.
                            </Alert>
                        )}
                    </Box>
                )}
            </Box>

            {/* Hub Edit Dialog */}
            <HubForm
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateHub}
                initialData={currentHub ? {
                    id: currentHub.id,
                    name: currentHub.name || '',
                    model: currentHub.model || '',
                    location: currentHub.location || ''
                } : {}}
                isEdit={true}
            />

            {/* Delete Hub Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Видалити хаб</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете видалити хаб "{currentHub.name}"? Цю дію не можна скасувати.
                        Всі пристрої, підключені до цього хаба, не відображатимуться в системі.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Скасувати</Button>
                    <Button onClick={handleDeleteHub} color="error" variant="contained">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            {/* API Key Dialog */}
            <Dialog open={openApiKeyDialog} onClose={handleCloseApiKeyDialog} maxWidth="sm" fullWidth>
                <DialogTitle>API-ключ хаба</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Використовуйте цей ключ API для авторизації запитів від хаба до сервера.
                        Зберігайте ключ у безпечному місці та не передавайте його третім особам.
                    </DialogContentText>

                    <TextField
                        fullWidth
                        label="API-ключ"
                        variant="outlined"
                        value={showApiKey ? currentHub.api_key : '••••••••••••••••••••••••••••••'}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleToggleApiKeyVisibility}
                                        edge="end"
                                    >
                                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={handleCopyApiKey}
                                        edge="end"
                                    >
                                        <CopyIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    {copySuccess && (
                        <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                            API-ключ скопійовано в буфер обміну!
                        </Typography>
                    )}

                    <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<RefreshIcon />}
                        onClick={handleOpenRegenerateDialog}
                    >
                        Згенерувати новий ключ
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApiKeyDialog}>Закрити</Button>
                </DialogActions>
            </Dialog>

            {/* Regenerate API Key Confirmation Dialog */}
            <Dialog open={openRegenerateDialog} onClose={handleCloseRegenerateDialog}>
                <DialogTitle>Підтвердження</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете створити новий API-ключ? Поточний ключ перестане працювати,
                        і вам потрібно буде оновити конфігурацію хаба.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRegenerateDialog}>Скасувати</Button>
                    <Button onClick={handleRegenerateApiKey} color="warning" variant="contained">
                        Згенерувати
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HubPage;