import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider,
    Chip,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    NoMeetingRoom as SpaceIcon,
    NotificationsActive as AlertIcon,
    Router as HubIcon
} from '@mui/icons-material';

import {getSpaces, createSpace} from '../redux/actions/spaceActions';
import {getIncidents} from '../redux/actions/incidentActions';
import {SpaceType} from '../utils/constants';

// Components
import SpaceForm from '../components/spaces/SpaceForm';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {spaces, loading: spacesLoading} = useSelector(state => state.spaces);
    const {incidents, loading: incidentsLoading} = useSelector(state => state.incidents);
    const {user} = useSelector(state => state.auth);

    const [openSpaceDialog, setOpenSpaceDialog] = useState(false);

    // Load data when component mounts
    useEffect(() => {
        dispatch(getSpaces());
        // If spaces exist, load incidents from the first space
        if (spaces && spaces.length > 0) {
            dispatch(getIncidents(spaces[0].id));
        }
    }, [dispatch, spaces?.length]);

    const handleOpenSpaceDialog = () => {
        setOpenSpaceDialog(true);
    };

    const handleCloseSpaceDialog = () => {
        setOpenSpaceDialog(false);
    };

    const handleCreateSpace = async (spaceData) => {
        const result = await dispatch(createSpace(spaceData));
        if (result) {
            handleCloseSpaceDialog();
            dispatch(getSpaces());
        }
    };

    const handleRefresh = () => {
        dispatch(getSpaces());
        if (spaces && spaces.length > 0) {
            dispatch(getIncidents(spaces[0].id));
        }
    };

    // Filter active incidents (not resolved and not marked as false alarm)
    const activeIncidents = incidents ? incidents.filter(incident =>
        incident.status !== 'RESOLVED' && incident.status !== 'FALSE_ALARM'
    ) : [];

    // Get total hub and device counts across all spaces
    const getTotalCounts = () => {
        let hubCount = 0;
        let deviceCount = 0;

        spaces?.forEach(space => {
            hubCount += space.hub_count || 0;
            deviceCount += space.device_count || 0;
        });

        return {hubCount, deviceCount};
    };

    const {hubCount, deviceCount} = getTotalCounts();

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Панель керування
                </Typography>
                <IconButton onClick={handleRefresh} color="primary">
                    <RefreshIcon/>
                </IconButton>
            </Box>

            <Grid container spacing={3}>
                {/* Welcome Card */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                Привіт, {user?.first_name || 'Користувач'}!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Це ваша панель керування безпечними просторами. Тут ви можете керувати просторами,
                                хабами та відстежувати інциденти.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Stats Cards */}
                <Grid item xs={12} md={4}>
                    <Card sx={{height: '100%'}}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" component="h3">
                                    <Box display="flex" alignItems="center">
                                        <SpaceIcon color="primary" sx={{mr: 1}}/>
                                        Простори
                                    </Box>
                                </Typography>
                                <Chip label={`${spaces?.length || 0}`} color="primary"/>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            <Typography variant="body2">
                                {spaces?.length > 0
                                    ? `У вас ${spaces.length} просторів`
                                    : 'У вас ще немає просторів'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={handleOpenSpaceDialog}
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Створити простір
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{height: '100%'}}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" component="h3">
                                    <Box display="flex" alignItems="center">
                                        <HubIcon color="primary" sx={{mr: 1}}/>
                                        Хаби
                                    </Box>
                                </Typography>
                                <Chip label={hubCount} color="primary"/>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            <Typography variant="body2">
                                {hubCount > 0
                                    ? `У вас ${hubCount} ${hubCount === 1 ? 'хаб' : 'хабов'}`
                                    : 'У вас ще немає хабів. Створіть простір і додайте хаб.'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {spaces?.length > 0 ? (
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/spaces/${spaces[0].id}`)}
                                >
                                    Керування хабами
                                </Button>
                            ) : (
                                <Button
                                    size="small"
                                    disabled
                                >
                                    Спочатку створіть простір
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{height: '100%'}}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" component="h3">
                                    <Box display="flex" alignItems="center">
                                        <AlertIcon color={activeIncidents?.length > 0 ? "error" : "success"}
                                                   sx={{mr: 1}}/>
                                        Активні інциденти
                                    </Box>
                                </Typography>
                                <Chip
                                    label={activeIncidents?.length || 0}
                                    color={activeIncidents?.length > 0 ? "error" : "success"}
                                />
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {incidentsLoading ? (
                                <Box display="flex" justifyContent="center" p={2}>
                                    <CircularProgress size={24}/>
                                </Box>
                            ) : activeIncidents?.length > 0 ? (
                                <Typography variant="body2">
                                    У
                                    вас {activeIncidents.length} {activeIncidents.length === 1 ? 'активний інцидент' : 'активних інцидентів'},
                                    потребующих уваги
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="success.main">
                                    Нема активних інцидентів. Усі системи працюють нормально.
                                </Typography>
                            )}
                        </CardContent>
                        {activeIncidents?.length > 0 && (
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/spaces/${incidents[0].space_id}`)}
                                >
                                    Подивитися інциденти
                                </Button>
                            </CardActions>
                        )}
                    </Card>
                </Grid>

                {/* Spaces List */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Ваші простори
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            {spacesLoading ? (
                                <Box display="flex" justifyContent="center" p={2}>
                                    <CircularProgress size={24}/>
                                </Box>
                            ) : spaces?.length > 0 ? (
                                <Grid container spacing={2}>
                                    {spaces.map((space) => (
                                        <Grid item xs={12} sm={6} md={4} key={space.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="subtitle1" component="h4">
                                                        {space.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {SpaceType[space.type] || space.type}
                                                        {space.address && ` • ${space.address}`}
                                                    </Typography>
                                                    <Box display="flex" mt={2} gap={1}>
                                                        <Chip
                                                            size="small"
                                                            label={`${space.hub_count || 0} хабів`}
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            size="small"
                                                            label={`${space.device_count || 0} пристроїв`}
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        onClick={() => navigate(`/spaces/${space.id}`)}
                                                    >
                                                        Керування
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    У вас ще немає просторів. Створіть ваш перший простір!
                                </Alert>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={handleOpenSpaceDialog}
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Створити простір
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            {/* Create Space Dialog */}
            <SpaceForm
                open={openSpaceDialog}
                onClose={handleCloseSpaceDialog}
                onSubmit={handleCreateSpace}
            />
        </Box>
    );
};

export default Dashboard;