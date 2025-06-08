import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    ContentCopy as CopyIcon,
    Refresh as RefreshIcon,
    SignalWifi4Bar as SignalIcon,
    SignalWifiOff as SignalOffIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

import { regenerateHubApiKey } from '../../redux/actions/hubActions';

const HubCard = ({ hub, onViewDetails }) => {
    const dispatch = useDispatch();

    const [openApiDialog, setOpenApiDialog] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [openRegenerateDialog, setOpenRegenerateDialog] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleOpenApiDialog = () => {
        setOpenApiDialog(true);
    };

    const handleCloseApiDialog = () => {
        setOpenApiDialog(false);
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
        navigator.clipboard.writeText(hub.api_key);
        setCopySuccess(true);

        // Reset copy success message after 2 seconds
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };

    const handleRegenerateApiKey = async () => {
        await dispatch(regenerateHubApiKey(hub.id));
        setOpenRegenerateDialog(false);
    };

    return (
        <>
            <Card variant="outlined" sx={{ width: '100%',height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                        {hub.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {hub.model || 'Хаб'}
                        {hub.location && ` • ${hub.location}`}
                    </Typography>
                    <Box display="flex" mt={2}>
                        <Chip
                            icon={hub.is_active ? <SignalIcon /> : <SignalOffIcon />}
                            label={hub.is_active ? 'Онлайн' : 'Оффлайн'}
                            size="small"
                            color={hub.is_active ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                        {hub.device_count !== undefined && (
                            <Chip
                                label={`${hub.device_count} пристрої (в)`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => onViewDetails(hub.space_id, hub.id)}>
                        Детальніше
                    </Button>
                    <Button size="small" onClick={handleOpenApiDialog}>
                        API-ключ
                    </Button>
                </CardActions>
            </Card>

            {/* API Key Dialog */}
            <Dialog open={openApiDialog} onClose={handleCloseApiDialog}>
                <DialogTitle>API-ключ для хаба</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Используйте этот API-ключ для авторизации запросов от хаба к серверу.
                        Храните ключ в безопасном месте и не передавайте его третьим лицам.
                    </DialogContentText>

                    <TextField
                        fullWidth
                        label="API-ключ"
                        variant="outlined"
                        value={showApiKey ? hub.api_key : '••••••••••••••••••••••••••••••'}
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
                            API-ключ скопирован в буфер обмена!
                        </Typography>
                    )}

                    <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<RefreshIcon />}
                        onClick={handleOpenRegenerateDialog}
                    >
                        Сгенерировать новый ключ
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApiDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            {/* Regenerate API Key Confirmation Dialog */}
            <Dialog open={openRegenerateDialog} onClose={handleCloseRegenerateDialog}>
                <DialogTitle>Подтверждение</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите сгенерировать новый API-ключ? Текущий ключ перестанет работать,
                        и вам потребуется обновить конфигурацию хаба.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRegenerateDialog}>Скасувати</Button>
                    <Button onClick={handleRegenerateApiKey} color="warning" variant="contained">
                        Сгенерировать
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HubCard;