import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Share2, MessageCircle, Link2, ArrowRight } from 'lucide-react';

const LandingFooter = () => {
    return (
        <footer className="pt-20 pb-10 text-white bg-slate-900">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/favicon.svg" alt="SmartHub Logo" className="w-10 h-10" />
                            <span className="text-2xl font-black tracking-tighter">SmartHub</span>
                        </Link>
                        <p className="leading-relaxed text-slate-400">
                            The centralized intelligence platform for modern university infrastructure, asset management, and maintenance operations.
                        </p>
                        <div className="flex gap-4">
                            {[Globe, Share2, MessageCircle, Link2].map((Icon, i) => (
                                <a key={i} href="#" className="flex items-center justify-center w-10 h-10 transition-all rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-8 text-lg italic font-bold">Quick Links</h4>
                        <ul className="space-y-4 text-slate-400">
                            {['Catalogue', 'Bookings', 'Operational Support', 'Documentation', 'Audit Log', 'Legal'].map((link) => (
                                <li key={link} className="flex items-center gap-2 transition-colors hover:text-blue-400 group">
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black" />
                                    <Link to={`/${link.toLowerCase().split(' ')[0]}`}>{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-8 text-lg italic font-bold">Contact Ops</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-1 text-blue-500" />
                                <span className="text-sm font-medium">University Admin Building,<br />Operational Hub, Sector 7</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span className="font-mono text-sm font-medium">+1 (800) SMART-OPS</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium">support@smarthub.campus.edu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-8 text-lg font-bold">Newsletter</h4>
                        <p className="mb-6 text-slate-400">Stay updated with our latest news and offers.</p>
                        <div className="flex p-1 rounded-lg bg-slate-800">
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="w-full px-4 py-2 text-sm bg-transparent border-none outline-none"
                            />
                            <button className="px-4 py-2 text-sm font-bold transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-20 text-sm text-center border-t border-slate-800 text-slate-500">
                    <p>&copy; 2026 SmartHub Operations. All rights reserved. </p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
