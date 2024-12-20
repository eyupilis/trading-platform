import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from '../pages/Dashboard';
import Signals from '../pages/Signals';
import Education from '../pages/Education';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/education" element={<Education />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default AppRoutes;
