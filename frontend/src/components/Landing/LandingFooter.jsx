import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Share2, MessageCircle, Link2, ArrowRight } from 'lucide-react';

const LandingFooter = () => {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                                <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center text-[10px]">SH</div>
                            </div>
                            <span className="text-2xl font-black tracking-tighter">SmartHub</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed">
                            The centralized intelligence platform for modern university infrastructure, asset management, and maintenance operations.
                        </p>
                        <div className="flex gap-4">
                            {[Globe, Share2, MessageCircle, Link2].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all text-slate-300 hover:text-white">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 italic">Quick Links</h4>
                        <ul className="space-y-4 text-slate-400">
                            {['Catalogue', 'Bookings', 'Operational Support', 'Documentation', 'Audit Log', 'Legal'].map((link) => (
                                <li key={link} className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black" />
                                    <Link to={`/${link.toLowerCase().split(' ')[0]}`}>{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 italic">Contact Ops</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                <span className="text-sm font-medium">University Admin Building,<br />Operational Hub, Sector 7</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium font-mono">+1 (800) SMART-OPS</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium">support@smarthub.campus.edu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">Newsletter</h4>
                        <p className="text-slate-400 mb-6">Stay updated with our latest news and offers.</p>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-sm transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    <p>&copy; 2026 SmartHub Operations. All rights reserved. Designed with ❤️ by Antigravity.</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
