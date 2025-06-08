import React, { useState } from 'react';
import {
    Grid,
    Box,
    Tabs,
    Tab,
    Typography,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { DeviceType } from '../../utils/constants';
import DeviceCard from './DeviceCard';

const DeviceList = ({ devices = [], loading = false, onDeviceClick }) => {
    const [viewType, setViewType] = useState('all');

    // Group devices by type for categorized view
    const devicesByType = devices.reduce((acc, device) => {
        const type = device.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(device);
        return acc;
    }, {});

    const handleViewChange = (event, newValue) => {
        setViewType(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (devices.length === 0) {
        return (
            <Alert severity="info">
                Нет доступных устройств
            </Alert>
        );
    }

    return (
        <Box>
            {/* View Type Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={viewType} onChange={handleViewChange}>
                    <Tab value="all" label="Всі пристрої" />
                    <Tab value="categorized" label="По категоріям" />
                </Tabs>
            </Box>

            {/* All devices view */}
            {viewType === 'all' && (
                devices.length > 0 ? (
                    <Grid container spacing={2}>
                        {devices.map(device => (
                            <Grid item xs={12} sm={6} md={4} key={device.id}>
                                <DeviceCard
                                    device={device}
                                    onClick={() => onDeviceClick(device.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info">
                        Немає пристроїв
                    </Alert>
                )
            )}

            {/* Categorized view */}
            {viewType === 'categorized' && (
                Object.keys(devicesByType).length > 0 ? (
                    <Box>
                        {Object.entries(devicesByType).map(([type, deviceList]) => {
                            return (
                                <Box key={type} mb={4}>
                                    <Typography variant="h6" gutterBottom>
                                        {DeviceType[type] || type}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        {deviceList.map(device => (
                                            <Grid item xs={12} sm={6} md={4} key={device.id}>
                                                <DeviceCard
                                                    device={device}
                                                    onClick={() => onDeviceClick(device.id)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Alert severity="info">
                        Немає пристроїв
                    </Alert>
                )
            )}
        </Box>
    );
};

export default DeviceList;