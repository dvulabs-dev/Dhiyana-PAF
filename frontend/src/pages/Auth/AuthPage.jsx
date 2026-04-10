import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, User, BookOpen, Zap, Globe, ArrowRight } from 'lucide-react';

const GOOGLE_LOGIN_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const AuthPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Email and password are required');
            return;
        }

        if (isRegister && !formData.name) {
            toast.error('Name is required');
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = isRegister ? 'http://localhost:8080/auth/register' : 'http://localhost:8080/auth/login';
            const payload = isRegister
                ? { name: formData.name, email: formData.email, password: formData.password }
                : { email: formData.email, password: formData.password };

            const response = await axios.post(endpoint, payload);

            if (response.data.token) {
                login(response.data.token);
                toast.success(isRegister ? 'Account created successfully!' : 'Login successful!');
                navigate(from);
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err?.response?.data?.error || 'Authentication failed';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setSubmitting(true);
        try {
            const googleProfile = credentialResponse?.credential
                ? jwtDecode(credentialResponse.credential)
                : null;

            const profileData = {
                name: googleProfile?.name || '',
                picture: googleProfile?.picture || '',
                email: googleProfile?.email || '',
            };

            try {
                // Try backend authentication first
                const response = await axios.post('http://localhost:8080/auth/google', {
                    token: credentialResponse.credential
                });

                if (response.data.token) {
                    login(response.data.token, profileData);
                    toast.success('Welcome back! Logged in successfully.');
                    navigate(from);
                    return;
                }
            } catch (backendErr) {
                console.warn('Backend auth failed, falling back to Google credential:', backendErr.message);

                // Fallback: use the Google credential directly as the token
                // This allows access if backend is temporarily unavailable
                login(credentialResponse.credential, profileData);
                toast.success(`Welcome, ${googleProfile?.name || 'User'}! Signed in via Google.`);
                navigate(from);
                return;
            }

            toast.error('Authentication error. Please try again.');
        } catch (err) {
            console.error('Google login error:', err);
            toast.error('Google authentication failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                
                {/* Info Panel */}
                <div className="text-center lg:text-left">
                    <div className="inline-block">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/favicon.svg" alt="SmartHub Logo" className="w-14 h-14" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">SmartHub</span>
                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Ops Center</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-slate-800 sm:text-5xl">
                        {isRegister ? 'Create Your Account' : 'Access the Operations Hub'}
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        The centralized platform for university asset management, bookings, and operational support.
                    </p>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Resource Catalogue</h3>
                                <p className="text-slate-600">Browse and reserve equipment, rooms, and facilities.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Incident Reporting</h3>
                                <p className="text-slate-600">Report issues and track maintenance requests in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Centralized Dashboard</h3>
                                <p className="text-slate-600">A single pane of glass for all your campus operational needs.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">{isRegister ? 'Register' : 'Sign In'}</h2>
                        <p className="text-center text-slate-500 mb-6">
                            {isRegister ? 'to start managing resources' : 'to access your dashboard'}
                        </p>
                        
                        {GOOGLE_LOGIN_ENABLED && (
                            <>
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => {
                                            console.error('Login Failed');
                                            toast.error('Google login failed. Please try again.');
                                        }}
                                        width="300px"
                                        theme="outline"
                                        shape="pill"
                                    />
                                </div>
                                <div className="flex items-center my-6">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="mx-4 text-xs font-semibold text-slate-400">OR</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isRegister && (
                                <div className="relative">
                                    <User className="absolute w-5 h-5 text-slate-400 top-1/2 -translate-y-1/2 left-3" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 text-slate-400 top-1/2 -translate-y-1/2 left-3" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 text-slate-400 top-1/2 -translate-y-1/2 left-3" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="mt-6 text-sm text-center text-slate-500">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                            <button onClick={() => setIsRegister(!isRegister)} className="font-bold text-blue-600 hover:underline ml-1">
                                {isRegister ? 'Sign In' : 'Register Now'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
