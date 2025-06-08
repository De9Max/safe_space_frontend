import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import theme from './theme';
import { checkAuthStatus } from './redux/actions/authActions';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SpacePage from './pages/SpacePage';
import HubPage from './pages/HubPage';
import DevicePage from './pages/DevicePage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
};

const App = () => {
    const dispatch = useDispatch();

    // Check auth status when app loads
    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/spaces/:spaceId" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <SpacePage />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="spaces/:spaceId/hubs/:hubId" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <HubPage />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/devices/:deviceId" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DevicePage />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Settings />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;