import React from 'react';
import { Mail, MapPin, User, Search, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../../modules/Notifications/NotificationPanel';

const LandingNavbar = () => {
    const { user, logout, displayName, displayPicture } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = Boolean(user);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="w-full">
            {/* Top Bar */}
            <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 lg:px-8 hidden md:block border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-blue-400" />
                            <span>support@smarthub.campus.edu</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
                            <MapPin className="w-3 h-3 text-blue-400" />
                            <span>Campus Maintenance Center</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                    <LayoutDashboard className="w-3 h-3 text-blue-400" />
                                    <span>DASHBOARD</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                                    <LogOut className="w-3 h-3" />
                                    <span>LOGOUT</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                    <User className="w-3 h-3 text-blue-400" />
                                    <span>OPERATIONS LOGIN</span>
                                </Link>
                                <Link to="/tickets" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 font-black transition-colors shadow-lg shadow-blue-500/20 rounded-md">
                                    FILE INCIDENT
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-3">
                                <img src="/favicon.svg" alt="SmartHub Logo" className="w-10 h-10" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">SmartHub</span>
                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Ops Center</span>
                                </div>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center ml-12 space-x-8">
                                {[
                                    { label: 'Resources', to: '/catalogue' },
                                    { label: 'Bookings', to: '/bookings' },
                                    { label: 'Operations Hub', to: '/tickets' },
                                    ...(isLoggedIn && (user.roles?.some(r => ['ADMIN', 'MANAGER', 'TECHNICIAN'].includes(r.replace('ROLE_', ''))) || false)
                                        ? [{ label: 'Dashboard', to: '/dashboard' }]
                                        : [])
                                ].map((item) => (
                                    <Link key={item.label} to={item.to} className="group relative flex items-center gap-1">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {item.label}
                                        </span>
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-52 group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                />
                                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </div>

                            {isLoggedIn && (
                                <div className="flex items-center gap-1">
                                    <NotificationPanel />
                                    <div className="h-8 w-px bg-slate-100 mx-2"></div>
                                </div>
                            )}

                            {isLoggedIn ? (
                                /* Logged-in user profile section */
                                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                                    <div className="hidden md:flex flex-col text-right leading-tight">
                                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {displayName}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            {user?.roles?.[0]?.replace('ROLE_', '') || 'MEMBER'}
                                        </span>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full border-2 border-slate-200 group-hover:border-blue-500 transition-all overflow-hidden shadow-sm">
                                            {displayPicture ? (
                                                <img
                                                    src={displayPicture}
                                                    alt={displayName}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                                                    {displayName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="hidden md:flex p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                /* Not logged in - show login button */
                                <Link
                                    to="/login"
                                    className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
                                >
                                    <User className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}

                            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default LandingNavbar;
