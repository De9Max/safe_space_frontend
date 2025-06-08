import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3', // синий
            light: '#64b5f6',
            dark: '#1976d2',
        },
        secondary: {
            main: '#ff9800', // оранжевый - традиционный цвет для предупреждений
            light: '#ffb74d',
            dark: '#f57c00',
        },
        error: {
            main: '#f44336', // красный - для критических ошибок и инцидентов
        },
        warning: {
            main: '#ff9800', // оранжевый - для предупреждений
        },
        info: {
            main: '#2196f3', // синий - для информационных сообщений
        },
        success: {
            main: '#4caf50', // зеленый - для успешных операций
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

export default theme;