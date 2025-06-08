import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Box,
    Paper,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    InputBase,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import {
    Warning as WarningIcon,
    MoreVert as MoreIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';

import { updateIncidentStatus } from '../../redux/actions/incidentActions';
import { IncidentStatus, IncidentSeverity, formatDate, getSeverityColor } from '../../utils/constants';

const IncidentList = ({ incidents = [], loading = false }) => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Filter incidents based on search and filters
    const filteredIncidents = incidents.filter(incident => {
        const matchesSearch = searchTerm === '' ||
            incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (incident.description && incident.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === '' || incident.status === statusFilter;
        const matchesSeverity = severityFilter === '' || incident.severity === severityFilter;

        return matchesSearch && matchesStatus && matchesSeverity;
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleSeverityFilterChange = (event) => {
        setSeverityFilter(event.target.value);
    };

    const handleMenuOpen = (event, incident) => {
        setAnchorEl(event.currentTarget);
        setSelectedIncident(incident);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenStatusDialog = () => {
        if (selectedIncident) {
            setNewStatus(selectedIncident.status);
            setOpenStatusDialog(true);
            handleMenuClose();
        }
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleUpdateStatus = async () => {
        if (selectedIncident && newStatus) {
            await dispatch(updateIncidentStatus(selectedIncident.id, { status: newStatus }));
            handleCloseStatusDialog();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (incidents.length === 0) {
        return (
            <Alert severity="success">
                Нет зарегистрированных инцидентов
            </Alert>
        );
    }

    return (
        <Box>
            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
                    <Box display="flex" alignItems="center" flex={1}>
                        <InputBase
                            placeholder="Поиск инцидентов..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{ ml: 1, flex: 1 }}
                            startAdornment={<SearchIcon color="action" sx={{ mr: 1 }} />}
                        />
                        {searchTerm && (
                            <IconButton size="small" onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Box display="flex" gap={2} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="status-filter-label">Статус</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={statusFilter}
                                label="Статус"
                                onChange={handleStatusFilterChange}
                            >
                                <MenuItem value="">Все</MenuItem>
                                {Object.entries(IncidentStatus).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="severity-filter-label">Важность</InputLabel>
                            <Select
                                labelId="severity-filter-label"
                                id="severity-filter"
                                value={severityFilter}
                                label="Важность"
                                onChange={handleSeverityFilterChange}
                            >
                                <MenuItem value="">Все</MenuItem>
                                {Object.entries(IncidentSeverity).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Paper>

            {/* Incidents List */}
            {filteredIncidents.length > 0 ? (
                <Paper>
                    <List>
                        {filteredIncidents.map((incident, index) => (
                            <React.Fragment key={incident.id}>
                                {index > 0 && <Divider component="li" />}
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon>
                                        <WarningIcon color={getSeverityColor(incident.severity)} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="subtitle1" component="span">
                                                    {incident.title}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={IncidentSeverity[incident.severity] || incident.severity}
                                                    color={getSeverityColor(incident.severity)}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    display="block"
                                                >
                                                    {incident.description}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {incident.device_name && `Устройство: ${incident.device_name} • `}
                                                    {formatDate(incident.created_at)}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                label={IncidentStatus[incident.status] || incident.status}
                                                color={
                                                    incident.status === 'NEW'
                                                        ? 'error'
                                                        : incident.status === 'ACKNOWLEDGED'
                                                            ? 'warning'
                                                            : 'success'
                                                }
                                                size="small"
                                            />
                                            <IconButton edge="end" onClick={(e) => handleMenuOpen(e, incident)}>
                                                <MoreIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Alert severity="info">
                    Нет инцидентов, соответствующих критериям поиска
                </Alert>
            )}

            {/* Incident Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleOpenStatusDialog}>Изменить статус</MenuItem>
            </Menu>

            {/* Update Status Dialog */}
            <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
                <DialogTitle>Изменить статус инцидента</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Выберите новый статус для инцидента "{selectedIncident?.title}".
                    </DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="update-status-label">Статус</InputLabel>
                        <Select
                            labelId="update-status-label"
                            id="update-status"
                            value={newStatus}
                            label="Статус"
                            onChange={handleStatusChange}
                        >
                            {Object.entries(IncidentStatus).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStatusDialog}>Скасувати</Button>
                    <Button onClick={handleUpdateStatus} variant="contained">Изменить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default IncidentList;