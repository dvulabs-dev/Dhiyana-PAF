import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Calendar, Ticket, LogOut, User, Mail, MapPin, Shield } from 'lucide-react';

import NotificationPanel from '../modules/Notifications/NotificationPanel';

const Navbar = () => {
    const { user, logout, displayName, displayPicture } = useAuth();
    const brandHomePath = '/';

    const navItems = [
        ...(user.roles?.some(r => ['ADMIN', 'MANAGER', 'TECHNICIAN'].includes(r.replace('ROLE_', ''))) || false
            ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
            : []),
        { to: '/catalogue', label: 'Catalogue', icon: BookOpen },
        { to: '/bookings', label: 'My Bookings', icon: Calendar },
        { to: '/tickets', label: 'Operations Hub', icon: Ticket },
        ...(user.roles?.some(r => r.replace('ROLE_', '') === 'ADMIN') || false
            ? [{ to: '/admin', label: 'Admin Control', icon: Shield }]
            : []),
    ];

    const rawRole = user?.roles?.[0];
    const displayRole = typeof rawRole === 'string' && rawRole.length <= 30 ? rawRole.replace('ROLE_', '') : 'MEMBER';

    return (
        <header className="w-full">
            {/* Top Bar for consistency */}
            <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 lg:px-8 hidden md:block border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>Operations Center Online</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span>Campus Network Active</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-blue-400">Secure Audit Active</span>
                    </div>
                </div>
            </div>

            <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to={brandHomePath} className="flex-shrink-0 flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs border border-white/20 shadow-lg group-hover:bg-blue-600 transition-colors">SH</div>
                                <div className="flex flex-col border-l border-slate-200 pl-3">
                                    <span className="text-xl font-black text-slate-900 tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">SmartHub</span>
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Ops Center</span>
                                </div>
                            </Link>
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `inline-flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all rounded-xl ${
                                                isActive 
                                                ? 'text-blue-600 bg-blue-50 shadow-inner' 
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <NotificationPanel />
                            
                            <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block"></div>

                            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                                <div className="hidden md:flex flex-col text-right leading-tight">
                                    <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{displayName}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{displayRole}</span>
                                </div>
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-full border-2 border-slate-100 group-hover:border-blue-500 transition-all overflow-hidden shadow-sm">
                                        {displayPicture ? (
                                            <img
                                                src={displayPicture}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                                                {displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                            </div>
    
                            <button 
                                onClick={logout}
                                className="ml-2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
