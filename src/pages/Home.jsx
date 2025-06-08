import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {
    Box,
    Container,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Security as SecurityIcon,
    DevicesOther as DevicesIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useSelector(state => state.auth);

    const features = [
        {
            icon: <SecurityIcon fontSize="large" color="primary"/>,
            title: 'Універсальна безпека',
            description: 'Створюйте безпечні простори будь-якого типу - будинок, квартира, офіс чи промисловий об\'єкт'
        },
        {
            icon: <DevicesIcon fontSize="large" color="primary"/>,
            title: 'Підтримка різних пристроїв',
            description: 'Підключайте датчики руху, датчики диму, протікання води та багато іншого'
        },
        {
            icon: <NotificationsIcon fontSize="large" color="primary"/>,
            title: 'Миттєві повідомлення',
            description: 'Отримуйте миттєві повідомлення про події та переглядайте їх історію'
        }
    ];

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" sx={{ borderRadius: 0 }} >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Універсальна платформа безпечного простору
                    </Typography>
                    {isAuthenticated ? (
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Панель керування
                        </Button>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Вхід
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Реєстрація
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    pt: 8,
                    pb: 6,
                    bgcolor: 'primary.main',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component="h1"
                        variant="h2"
                        gutterBottom
                    >
                        Створіть свій безпечний простір
                    </Typography>
                    <Typography variant="h5" paragraph sx={{mb: 4}}>
                        Універсальна платформа для моніторингу та забезпечення безпеки у будь-якому просторі
                    </Typography>
                    {isAuthenticated ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                        >
                            Перейти до особистого кабінету
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/register')}
                        >
                            Почати безкоштовно
                        </Button>
                    )}
                </Container>
            </Box>

            <Container sx={{py: 8}} maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom>
                    Основні можливості
                </Typography>
                <Grid container spacing={4} sx={{mt: 2}}>
                    {features.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    p: 2
                                }}
                            >
                                <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                                    {feature.icon}
                                </Box>
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {feature.title}
                                    </Typography>
                                    <Typography>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) => theme.palette.grey[200]
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body1" align="center">
                        © {new Date().getFullYear()} Платформа безпечного простору
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;