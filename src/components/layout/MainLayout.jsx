import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    AccountCircle,
    NoMeetingRoom as SpaceIcon,
} from '@mui/icons-material';

import { logout } from '../../redux/actions/authActions';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { spaces } = useSelector(state => state.spaces);
    const { loading } = useSelector(state => state.ui);
    const { alert } = useSelector(state => state.ui);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        dispatch(logout());
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigate('/dashboard')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Панель керування" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />
            {spaces.length > 0 && (
                <>
                    <Typography variant="subtitle2" sx={{ p: 2, color: 'text.secondary' }}>
                        Простори
                    </Typography>
                    <List>
                        {spaces && spaces.map((space) => (
                            <ListItem key={space.id} disablePadding>
                                <ListItemButton onClick={() => handleNavigate(`/spaces/${space.id}`)}>
                                    <ListItemIcon>
                                        <SpaceIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={space.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </>
            )}


            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigate('/settings')}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Налаштування" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderRadius: 0 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Універсальна платформа безпечного простору
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            {user && user.first_name ? user.first_name[0] : '?'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={profileMenuAnchor}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleProfileMenuClose();
                            navigate('/settings');
                        }}>
                            <ListItemIcon>
                                <AccountCircle fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit">Профіль</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit">Вихід</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Toolbar />
                {drawer}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                {children}
            </Box>

            {/* Повідомлення */}
            {alert && (
                <Snackbar
                    open={!!alert}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert severity={alert.severity} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default MainLayout;