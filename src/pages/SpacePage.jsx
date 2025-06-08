import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    DevicesOther as DevicesIcon,
    Warning as WarningIcon,
    Router as HubIcon
} from '@mui/icons-material';

import { getSpace, updateSpace, deleteSpace } from '../redux/actions/spaceActions';
import { getDevices } from '../redux/actions/deviceActions';
import { getHubs, createHub } from '../redux/actions/hubActions';
import { getIncidents } from '../redux/actions/incidentActions';
import { SpaceType } from '../utils/constants';

// Components
import DeviceList from '../components/devices/DeviceList';
import HubList from '../components/hubs/HubList';
import HubForm from '../components/hubs/HubForm';
import SpaceForm from '../components/spaces/SpaceForm';
import IncidentList from '../components/incidents/IncidentList';

const SpacePage = () => {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentSpace, loading: spaceLoading } = useSelector(state => state.spaces);
    const { devices, loading: devicesLoading } = useSelector(state => state.devices);
    const { hubs, loading: hubsLoading } = useSelector(state => state.hubs);
    const { incidents, loading: incidentsLoading } = useSelector(state => state.incidents);

    const [tabValue, setTabValue] = useState(0);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddHubDialog, setOpenAddHubDialog] = useState(false);

    // Load space data when component mounts
    useEffect(() => {
        if (spaceId) {
            dispatch(getSpace(parseInt(spaceId)));
            dispatch(getDevices(parseInt(spaceId)));
            dispatch(getHubs(parseInt(spaceId)));
            dispatch(getIncidents(parseInt(spaceId)));
        }
    }, [dispatch, spaceId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        dispatch(getSpace(parseInt(spaceId)));
        dispatch(getDevices(parseInt(spaceId)));
        dispatch(getHubs(parseInt(spaceId)));
        dispatch(getIncidents(parseInt(spaceId)));
    };

    // Edit space handlers
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleUpdateSpace = async (spaceData) => {
        const result = await dispatch(updateSpace(parseInt(spaceId), spaceData));
        if (result) {
            handleCloseEditDialog();
        }
    };

    // Delete space handlers
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteSpace = async () => {
        const result = await dispatch(deleteSpace(parseInt(spaceId)));
        if (result) {
            handleCloseDeleteDialog();
            navigate('/dashboard');
        }
    };

    // Hub handlers
    const handleOpenAddHubDialog = () => {
        setOpenAddHubDialog(true);
    };

    const handleCloseAddHubDialog = () => {
        setOpenAddHubDialog(false);
    };

    const handleAddHub = async (hubData) => {
        const result = await dispatch(createHub(parseInt(spaceId), hubData));
        if (result) {
            handleCloseAddHubDialog();
            dispatch(getHubs(parseInt(spaceId)));
        }
    };

    const handleHubClick = (spaceId, hubId) => {
        navigate(`/spaces/${spaceId}/hubs/${hubId}`);
    };

    const handleDeviceClick = (deviceId) => {
        navigate(`/devices/${deviceId}`);
    };

    if (spaceLoading && !currentSpace) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentSpace) {
        return (
            <Alert severity="error">
                Пространство не найдено. Возможно, оно было удалено или у вас нет к нему доступа.
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
                        {currentSpace.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {SpaceType[currentSpace.type] || currentSpace.type}
                        {currentSpace.address && ` • ${currentSpace.address}`}
                    </Typography>
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

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="space tabs">
                    <Tab
                        icon={<HubIcon />}
                        iconPosition="start"
                        label="Хаби"
                        id="tab-0"
                    />
                    <Tab
                        icon={<DevicesIcon />}
                        iconPosition="start"
                        label="Пристрої"
                        id="tab-1"
                    />
                    <Tab
                        icon={<WarningIcon />}
                        iconPosition="start"
                        label="Інциденти"
                        id="tab-2"
                    />
                </Tabs>
            </Box>

            {/* Tab content */}
            <Box sx={{ mt: 2 }}>
                {/* Hubs Tab */}
                {tabValue === 0 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Хаби</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddHubDialog}
                            >
                                Додати хаб
                            </Button>
                        </Box>

                        {hubsLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : hubs && hubs.length > 0 ? (
                                        <HubList
                                            hubs={hubs}
                                            loading={hubsLoading}
                                            onHubClick={handleHubClick}
                                        />
                        ) : (
                            <Alert severity="info">
                                В цьому просторі ще немає хабів. Додайте хаб.
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Devices Tab */}
                {tabValue === 1 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Пристрої</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Пристрої підключаються автоматично через хаби
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
                                У цьому просторі ще немає пристроїв. Пристрої будуть відображатися автоматично після їхнього підключення до хаба.
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Incidents Tab */}
                {tabValue === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Інциденти
                        </Typography>

                        {incidentsLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : incidents && incidents.length > 0 ? (
                            <IncidentList
                                incidents={incidents}
                                loading={incidentsLoading}
                            />
                        ) : (
                            <Alert severity="success">
                                В цьому просторі немає зареестрованих інцидентів
                            </Alert>
                        )}
                    </Box>
                )}
            </Box>

            {/* Space Edit Dialog */}
            <SpaceForm
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateSpace}
                initialData={currentSpace ? {
                    name: currentSpace.name || '',
                    type: currentSpace.type || '',
                    address: currentSpace.address || ''
                } : {}}
                isEdit={true}
            />

            {/* Delete Space Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Видалити простір</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете видалити простір "{currentSpace.name}"? Цю дію не можна скасувати.
                        Всі хаби та пристрої, пов'язані з цим простором, також будуть видалені.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Скасувати</Button>
                    <Button onClick={handleDeleteSpace} color="error" variant="contained">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Hub Dialog */}
            <HubForm
                open={openAddHubDialog}
                onClose={handleCloseAddHubDialog}
                onSubmit={handleAddHub}
            />
        </Box>
    );
};

export default SpacePage;