import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/Auth/AuthPage';
import ResourceList from './pages/Catalogue/ResourceList';
import MyBookings from './pages/Booking/MyBookings';
import TicketList from './pages/Ticketing/TicketList';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './components/Auth/RoleGuard';
import MainLayout from './layouts/MainLayout';

const Dashboard = () => {
    const { user, hasRole } = useAuth();
    
    const cards = [
        {
            title: 'Facilities & Assets Catalogue',
            description: 'Search, filter, and manage lecture halls, labs, and equipment.',
            to: '/catalogue',
            cta: 'Open Catalogue',
            roles: ['USER', 'ADMIN', 'MANAGER', 'TECHNICIAN']
        },
        {
            title: 'My Bookings',
            description: 'Review your active and upcoming reservations in one place.',
            to: '/bookings',
            cta: 'View Bookings',
            roles: ['USER', 'ADMIN', 'MANAGER']
        },
        {
            title: 'Support Tickets',
            description: 'Track issues and requests related to facilities and services.',
            to: '/tickets',
            cta: 'Open Support',
            roles: ['USER', 'ADMIN', 'TECHNICIAN']
        },
        {
            title: 'Admin Panel',
            description: 'Manage users, roles, and system configuration.',
            to: '/admin',
            cta: 'Open Admin',
            roles: ['ADMIN']
        }
    ].filter(card => card.roles.some(role => hasRole(role)));

    return (
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white min-h-[calc(100vh-9rem)]">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Welcome to your Dashboard</h1>
            <p className="mt-2 text-slate-600">Choose a module to continue.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.to} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                        <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
                        <p className="mt-2 text-slate-600">{card.description}</p>
                        <Link
                            to={card.to}
                            className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
                        >
                            {card.cta}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
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
                        <Route path="/admin" element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                                <MainLayout><div>Admin Panel (Work in Progress)</div></MainLayout>
                            </RoleGuard>
                        } />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;
