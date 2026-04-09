import React from 'react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';

const LandingLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <LandingNavbar />
            <main className="flex-grow">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingLayout;
