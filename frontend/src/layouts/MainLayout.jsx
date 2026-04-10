import React from 'react';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f1f5f9] flex overflow-hidden font-sans">
            <Navbar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Minimal Top Header matching the requested UI  */}
                <header className="bg-[#f1f5f9] h-20 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
                     <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        Operations Center Active
                    </div>
                    <div className="relative w-full max-w-xs ml-auto">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search system..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border-none shadow-sm rounded-full text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
