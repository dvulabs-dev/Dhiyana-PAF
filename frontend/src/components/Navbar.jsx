import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Calendar, Ticket, LogOut, User, Shield } from 'lucide-react';

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
        <aside className="w-64 lg:w-72 bg-[#081021] flex-shrink-0 flex flex-col h-screen overflow-y-auto sticky top-0 shadow-2xl z-50 rounded-r-3xl border-r border-blue-900/30">
            {/* Profile Section inside Sidebar */}
            <div className="flex flex-col items-center pt-10 pb-8 px-6">
                <div className="relative mb-4 group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800 flex items-center justify-center text-3xl font-black text-white group-hover:border-blue-400 group-hover:scale-105 transition-all duration-300">
                        {displayPicture ? (
                            <img src={displayPicture} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            displayName?.[0]?.toUpperCase() || <User className="w-10 h-10" />
                        )}
                    </div>
                </div>
                <h2 className="text-white font-black text-lg tracking-tight text-center leading-tight mb-1 drop-shadow-md">{displayName}</h2>
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest truncate max-w-[200px] mb-3 drop-shadow-sm">{user?.email}</p>
                <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/20 rounded-full text-[9px] font-black text-blue-200 uppercase tracking-[0.2em] border border-blue-400/30 backdrop-blur-sm">
                    {displayRole}
                </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="flex-1 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative overflow-visible ${
                                isActive 
                                ? 'text-slate-900 bg-[#f1f5f9] rounded-l-3xl shadow-[-10px_0_20px_rgba(0,0,0,0.15)] ml-4 z-10 before:absolute before:right-0 before:-top-5 before:w-5 before:h-5 before:bg-transparent before:rounded-br-2xl before:shadow-[10px_10px_0_0_#f1f5f9] after:absolute after:right-0 after:-bottom-5 after:w-5 after:h-5 after:bg-transparent after:rounded-tr-2xl after:shadow-[10px_-10px_0_0_#f1f5f9]' 
                                : 'text-slate-300 hover:text-white hover:bg-white/10 rounded-l-3xl ml-4 mr-2 transition-colors'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className="w-5 h-5 mr-4" />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-6 mt-auto">
                <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-6 py-4 rounded-2xl text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors border border-transparent hover:border-red-500/30"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Navbar;
