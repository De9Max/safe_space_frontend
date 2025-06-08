import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Страница не найдена
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Извините, но страница, которую вы ищете, не существует или была перемещена.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/"
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;