import React from 'react';
import { Mail, MapPin, User, Search, ChevronDown, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
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
                    <div className="flex items-center space-x-6">
                        <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                            <User className="w-3 h-3 text-blue-400" />
                            <span>OPERATIONS LOGIN</span>
                        </Link>
                        <Link to="/support" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 font-black transition-colors shadow-lg shadow-blue-500/20 rounded-md">
                            FILE INCIDENT
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                    <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center text-[10px]">SH</div>
                                </div>
                                <span className="text-2xl font-black text-slate-900 tracking-tighter">SmartHub</span>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center ml-12 space-x-8">
                                {['Resources', 'Bookings', 'Operations', 'Support'].map((item) => (
                                    <div key={item} className="group relative flex items-center gap-1 cursor-pointer">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {item}
                                        </span>
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search and Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                />
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
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
