import React from 'react';
import { Container, Typography } from '@mui/material';

function HomePage() {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Welcome to the Task Manager
            </Typography>
            <Typography variant="body1">
                Use the navigation bar to go to the tasks page.
            </Typography>
        </Container>
    );
}

export default HomePage;
