import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Link,
    Paper,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

import { login, clearErrors } from '../redux/actions/authActions';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Если пользователь уже аутентифицирован, перенаправляем на панель управления
        if (isAuthenticated) {
            navigate('/dashboard');
        }

        // Очистка ошибок при размонтировании компонента
        return () => {
            dispatch(clearErrors());
        };
    }, [isAuthenticated, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Очистка ошибки для поля при изменении
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: ''
            });
        }
    };

    const validate = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email обязателен для заполнения';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Некорректный формат email';
        }

        if (!formData.password) {
            errors.password = 'Пароль обязателен для заполнения';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            dispatch(login(formData.email, formData.password));
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Вход в систему
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Вхід'}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    {"Немає аккаунта? Зареєструйте"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Box mt={3}>
                    <Button
                        color="primary"
                        component={RouterLink}
                        to="/"
                    >
                        Повернутися на головну
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;