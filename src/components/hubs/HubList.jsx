import React, { useState } from 'react';
import {
    Grid,
    Box,
    Paper,
    InputBase,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';

import HubCard from './HubCard';

const HubList = ({ hubs = [], loading = false, onHubClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter hubs based on search
    const filteredHubs = hubs.filter(hub => {
        const matchesSearch = searchTerm === '' ||
            hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hub.location && hub.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (hub.model && hub.model.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    console.log(filteredHubs);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (hubs.length === 0) {
        return (
            <Alert severity="info">
                Нет доступных хабов
            </Alert>
        );
    }

    return (
        <Box>
            {/* Search */}
            {hubs.length > 3 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" alignItems="center">
                        <InputBase
                            placeholder="Поиск хабов..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{ ml: 1, flex: 1 }}
                            startAdornment={<SearchIcon color="action" sx={{ mr: 1 }} />}
                        />
                        {searchTerm && (
                            <IconButton size="small" onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        )}
                    </Box>
                </Paper>
            )}

            {/* Hub List */}
            {filteredHubs.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredHubs.map(hub => (
                        <Grid item xs={6} sm={6} md={8} key={hub.id}>
                            <HubCard
                                hub={hub}
                                onViewDetails={onHubClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info">
                    Нет хабов, соответствующих критериям поиска
                </Alert>
            )}
        </Box>
    );
};

export default HubList;