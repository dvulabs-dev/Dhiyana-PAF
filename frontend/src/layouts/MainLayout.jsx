import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-bold text-gray-300 uppercase tracking-widest">
                    &copy; 2026 Smart Campus Hub. All rights automated.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
