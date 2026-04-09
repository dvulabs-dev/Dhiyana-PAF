import React from 'react';
import { ArrowRight, GraduationCap, Users, BookMarked, Languages, Laptop, Trophy, UserCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[650px] w-full flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img 
                        src="/images/hero.png" 
                        alt="Smart Campus Administration" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-white">
                        <span className="inline-block text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 animate-fade-in">
                            UNIVERSITY MODERNIZATION PORTAL
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Smart Campus<br />
                            <span className="text-sky-400">Operations</span> Hub
                        </h1>
                        <p className="text-lg text-slate-200 mb-10 leading-relaxed max-w-lg">
                            A unified platform to manage facilities, asset bookings, and real-time maintenance handling with full auditability and role-based control.
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                to="/catalogue" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 group"
                            >
                                Manage Assets
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Overlay Section */}
            <section className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 shadow-2xl rounded-2xl overflow-hidden">
                    {[
                        { 
                            title: 'Facility Catalogue', 
                            desc: 'Full visibility into lecture halls, labs, and equipment with capacity and status tracking.', 
                            icon: Laptop,
                            color: 'bg-white'
                        },
                        { 
                            title: 'Operational Bookings', 
                            desc: 'Seamless reservation workflow for campus assets with conflict resolution and role-based access.', 
                            icon: UserCheck,
                            color: 'bg-white'
                        },
                        { 
                            title: 'Maintenance Hub', 
                            desc: 'Incident reporting, fault management, and technician updates with clear resolution tracking.', 
                            icon: Zap,
                            color: 'bg-white'
                        }
                    ].map((feature, i) => (
                        <div key={i} className={`${feature.color} p-10 border-r border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors group`}>
                            <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-sky-50/50 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {feature.desc}
                            </p>
                            <Link to="/catalogue" className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:text-blue-600 transition-colors">
                                Open Module <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <img src="/images/about.png" alt="Facility Management" className="rounded-2xl shadow-xl w-full h-64 object-cover" />
                                <div className="bg-slate-900 p-8 rounded-2xl text-white">
                                    <Trophy className="w-12 h-12 mb-4 text-blue-500" />
                                    <h4 className="text-3xl font-black">100%</h4>
                                    <p className="text-sm font-medium text-slate-400">Auditable Tracking</p>
                                </div>
                            </div>
                            <div className="pt-12">
                                <img src="/images/hero.png" alt="Campus Ops" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Our Mission</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                                Streamlining Campus<br />
                                Infrastructure <span className="text-blue-600">Operations</span>
                            </h2>
                            <p className="text-slate-600 mt-6 leading-relaxed">
                                Our platform provides a comprehensive backbone for university operations, ensuring that every facility and asset is utilized efficiently and maintained properly.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Clear role-based access control',
                                'Automated booking workflows',
                                'End-to-end maintenance tracking'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link 
                            to="/login" 
                            className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Facilities Tracked', value: '250+', icon: Laptop },
                            { label: 'Monthly Bookings', value: '1,200+', icon: UserCheck },
                            { label: 'Active Technicians', value: '15+', icon: Users },
                            { label: 'Reported Issues', value: '98%', icon: Trophy }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 border-r border-slate-200 last:border-r-0 md:border-r">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h4>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
