import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    MenuItem
} from '@mui/material';
import { SpaceType } from '../../utils/constants';

const SpaceForm = ({ open, onClose, onSubmit, initialData = { name: '', type: 'HOME', address: '' }, isEdit = false }) => {
    const [spaceData, setSpaceData] = useState(initialData);
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSpaceData({
            ...spaceData,
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
        if (!spaceData.name.trim()) {
            newErrors.name = 'Назва простору обов\'язкова';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(spaceData);
            resetForm();
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        if (!isEdit) {
            setSpaceData({ name: '', type: 'HOME', address: '' });
        }
        setErrors({});
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? 'Редагувати простір' : 'Створити новий простір'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    {isEdit
                        ? 'Змініть інформацію про простір'
                        : 'Заповніть інформацію про новий простір, який потрібно створити.'
                    }
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Назва простору"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={spaceData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                />

                <TextField
                    select
                    margin="dense"
                    id="type"
                    name="type"
                    label="Тип простору"
                    fullWidth
                    variant="outlined"
                    value={spaceData.type}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    {Object.entries(SpaceType).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            {value}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    margin="dense"
                    id="address"
                    name="address"
                    label="Адреса (опціонально)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={spaceData.address}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Скасувати</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {isEdit ? 'Зберегти' : 'Створити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SpaceForm;