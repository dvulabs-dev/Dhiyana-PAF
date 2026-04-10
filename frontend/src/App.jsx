import React from 'react';
import { BookOpen } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/Auth/AuthPage';
import ResourceList from './pages/Catalogue/ResourceList';
import MyBookings from './pages/Booking/MyBookings';
import TicketList from './pages/Ticketing/TicketList';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './components/Auth/RoleGuard';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import LandingLayout from './layouts/LandingLayout';
import PageHeader from './components/Common/PageHeader';
import OperationalSupport from './pages/Common/OperationalSupport';
import Documentation from './pages/Common/Documentation';
import AuditLog from './pages/Common/AuditLog';
import Legal from './pages/Common/Legal';
import UserCatalogue from './pages/User/UserCatalogue';
import UserBookings from './pages/User/UserBookings';
import UserSupport from './pages/User/UserSupport';
import AdminPanel from './pages/Admin/AdminPanel';

const RoleBasedRoute = ({ adminComponent: AdminComp, userComponent: UserComp, adminRoles }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const showAdmin = adminRoles.some(role => hasRole(role));

    if (showAdmin) {
        return (
            <MainLayout>
                <AdminComp />
            </MainLayout>
        );
    }

    return (
        <LandingLayout>
            <UserComp />
        </LandingLayout>
    );
};

const Dashboard = () => {
    const { user, hasRole } = useAuth();
    
    const cards = [
        {
            title: 'Infrastructure Catalogue',
            description: 'Monitor, provisioning, and status tracking of campus facilities and assets.',
            to: '/catalogue',
            cta: 'Open Catalogue',
            roles: ['USER', 'ADMIN', 'MANAGER', 'TECHNICIAN']
        },
        {
            title: 'Operating Bookings',
            description: 'Audit-ready management of upcoming facility and equipment reservations.',
            to: '/bookings',
            cta: 'View Bookings',
            roles: ['USER', 'ADMIN', 'MANAGER']
        },
        {
            title: 'Maintenance Hub',
            description: 'Incident response, incident tracking, and resolution monitoring.',
            to: '/tickets',
            cta: 'Open Operations',
            roles: ['USER', 'ADMIN', 'TECHNICIAN']
        },
        {
            title: 'Admin Operations',
            description: 'User access control, role management, and system governance.',
            to: '/admin',
            cta: 'Open Admin',
            roles: ['ADMIN']
        }
    ].filter(card => {
        // If user has no roles yet (e.g. Google login fallback), show all non-admin cards
        const userRoles = user?.roles || [];
        if (userRoles.length === 0) return !card.roles.includes('ADMIN');
        return card.roles.some(role => hasRole(role));
    });

    return (
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white min-h-[calc(100vh-10rem)]">
            <PageHeader 
                title={`Secure Access: ${user?.name || 'Authorized User'}`}
                description="Welcome to the SmartHub Operations Center. Monitor campus infrastructure, manage bookings, and handle incident resolutions from this unified dashboard."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.to} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                            <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 italic tracking-tight">{card.title}</h2>
                        <p className="mt-3 text-slate-500 font-medium leading-relaxed">{card.description}</p>
                        <Link
                            to={card.to}
                            className="mt-8 inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20"
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
            <ErrorBoundary>
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
                        <Route path="/catalogue" element={<RoleBasedRoute adminComponent={ResourceList} userComponent={UserCatalogue} adminRoles={['ADMIN', 'MANAGER']} />} />
                        <Route path="/bookings" element={<RoleBasedRoute adminComponent={MyBookings} userComponent={UserBookings} adminRoles={['ADMIN', 'MANAGER']} />} />
                        <Route path="/tickets" element={<RoleBasedRoute adminComponent={TicketList} userComponent={UserSupport} adminRoles={['ADMIN', 'TECHNICIAN']} />} />
                        <Route path="/admin" element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                                <MainLayout><AdminPanel /></MainLayout>
                            </RoleGuard>
                        } />
                        <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
                        <Route path="/operational" element={<LandingLayout><OperationalSupport /></LandingLayout>} />
                        <Route path="/documentation" element={<LandingLayout><Documentation /></LandingLayout>} />
                        <Route path="/audit" element={<LandingLayout><AuditLog /></LandingLayout>} />
                        <Route path="/legal" element={<LandingLayout><Legal /></LandingLayout>} />
                        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                                </Router>
                </NotificationProvider>
            </ErrorBoundary>
        </AuthProvider>
    );
};

export default App;
