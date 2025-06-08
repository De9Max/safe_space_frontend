import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box
} from '@mui/material';
import {
    SignalWifi4Bar as SignalIcon,
    SignalWifiOff as SignalOffIcon,
    BatteryFull as BatteryFullIcon,
    BatteryAlert as BatteryAlertIcon
} from '@mui/icons-material';

import { DeviceType } from '../../utils/constants';

const DeviceCard = ({ device, onClick }) => {
    // Display battery level
    const renderBatteryLevel = () => {
        if (device.battery_level === null || device.battery_level === undefined) {
            return null;
        }

        const batteryPercentage = Math.round(device.battery_level);
        const isLowBattery = batteryPercentage < 20;

        return (
            <Chip
                icon={isLowBattery ? <BatteryAlertIcon /> : <BatteryFullIcon />}
                label={`${batteryPercentage}%`}
                size="small"
                color={isLowBattery ? 'error' : 'success'}
                variant="outlined"
                sx={{ mr: 1 }}
            />
        );
    };

    const handleClick = () => {
        if (onClick) {
            onClick(device.id);
        }
    };

    return (
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {device.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {DeviceType[device.type] || device.type}
                    {device.location && ` • ${device.location}`}
                </Typography>
                <Box display="flex" mt={2}>
                    <Chip
                        icon={device.is_active ? <SignalIcon /> : <SignalOffIcon />}
                        label={device.is_active ? 'Онлайн' : 'Оффлайн'}
                        size="small"
                        color={device.is_active ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    />
                    {renderBatteryLevel()}
                </Box>
                {device.last_seen && (
                    <Typography variant="caption" color="text.secondary" display="block">
                        Остання активність: {new Date(device.last_seen).toLocaleString()}
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleClick}>
                    Детальніше
                </Button>
            </CardActions>
        </Card>
    );
};

export default DeviceCard;