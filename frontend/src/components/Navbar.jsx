import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Calendar, Ticket, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/catalogue', label: 'Catalogue', icon: BookOpen },
        { to: '/bookings', label: 'My Bookings', icon: Calendar },
        { to: '/tickets', label: 'Support', icon: Ticket },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
                            <span className="text-xl font-black text-gray-900 tracking-tighter">SmartHub</span>
                        </div>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `inline-flex items-center px-3 py-2 text-sm font-bold transition-all rounded-xl ${
                                            isActive 
                                            ? 'text-blue-600 bg-blue-50' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
                        <div className="hidden md:flex flex-col items-end mr-2 text-right">
                            <span className="text-sm font-bold text-gray-900">{user?.name}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.roles[0]}</span>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all">
                                {user?.picture ? (
                                    <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
