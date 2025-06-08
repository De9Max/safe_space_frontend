import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { clearAlert } from '../../redux/actions/uiActions';

const AlertNotification = () => {
    const dispatch = useDispatch();
    const { alert } = useSelector(state => state.ui);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(clearAlert());
    };

    if (!alert) return null;

    return (
        <Snackbar
            open={!!alert}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <Alert
                onClose={handleClose}
                severity={alert.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertNotification;