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
import { PersonAddOutlined as PersonAddOutlinedIcon } from '@mui/icons-material';

import { register, clearErrors } from '../redux/actions/authActions';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);

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
        } else if (formData.password.length < 6) {
            errors.password = 'Пароль должен содержать не менее 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.first_name) {
            errors.first_name = 'Имя обязательно для заполнения';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            // Копируем данные формы без поля confirmPassword
            const { confirmPassword, ...userData } = formData;

            // Регистрация пользователя
            const result = await dispatch(register(userData));

            if (result) {
                setSuccess(true);

                // Перенаправление на страницу входа через 2 секунды
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
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
                            <PersonAddOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Реєстрація
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Реєстрація успішна!
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="first_name"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="Ім'я"
                                    autoFocus
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    error={!!formErrors.first_name}
                                    helperText={formErrors.first_name}
                                    disabled={loading || success}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Прізвище"
                                    name="last_name"
                                    autoComplete="family-name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    error={!!formErrors.last_name}
                                    helperText={formErrors.last_name}
                                    disabled={loading || success}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Пошта"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    disabled={loading || success}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    label="Телефон"
                                    name="phone"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
                                    disabled={loading || success}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!formErrors.password}
                                    helperText={formErrors.password}
                                    disabled={loading || success}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Підтвердіть пароль"
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!formErrors.confirmPassword}
                                    helperText={formErrors.confirmPassword}
                                    disabled={loading || success}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading || success}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Зарееструватися'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Вже є аккаунт? Вхід
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

export default Register;