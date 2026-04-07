import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/Auth/AuthPage';
import ResourceList from './pages/Catalogue/ResourceList';
import MyBookings from './pages/Booking/MyBookings';
import TicketList from './pages/Ticketing/TicketList';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Placeholder Dashboard
const Dashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MainLayout><Dashboard /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/catalogue" element={
                        <ProtectedRoute>
                            <MainLayout><ResourceList /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/bookings" element={
                        <ProtectedRoute>
                            <MainLayout><MyBookings /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/tickets" element={
                        <ProtectedRoute>
                            <MainLayout><TicketList /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
