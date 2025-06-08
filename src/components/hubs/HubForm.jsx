import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    FormControl
} from '@mui/material';

const HubForm = ({ open, onClose, onSubmit, initialData = { name: '', model: '', location: '' } }) => {
    const [hubData, setHubData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHubData({
            ...hubData,
            [name]: value
        });

        // Clear error for the field being edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!hubData.name.trim()) {
            newErrors.name = 'Название хаба обязательно';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(hubData);
            resetForm();
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setHubData(initialData);
        setErrors({});
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{hubData.id ? 'Редагувати хаб' : 'Створити новый хаб'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    {hubData.id
                        ? 'Змініть інформацію о хабі'
                        : 'Заповніть інформацію про новий хаб, який ви хочете додати до цього простору. Після створення хаба ви отримаєте API-ключ для налаштування пристрою.'
                    }
                </DialogContentText>

                <Box component="form" noValidate>
                    <FormControl fullWidth error={!!errors.name} sx={{ mb: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Назва хабу"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={hubData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </FormControl>

                    <TextField
                        margin="dense"
                        id="model"
                        name="model"
                        label="Модель"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={hubData.model || ''}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Скасувати</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {hubData.id ? 'Зберегти' : 'Створити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HubForm;