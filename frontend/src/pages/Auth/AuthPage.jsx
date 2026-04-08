import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, BookOpen, Zap, Globe, ArrowRight } from 'lucide-react';

const AuthPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
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
                navigate('/dashboard');
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
            const response = await axios.post('http://localhost:8080/auth/google', {
                token: credentialResponse.credential
            });

            if (response.data.token) {
                login(response.data.token);
                toast.success('Login with Google successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Google login error:', err);
            toast.error('Google authentication failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative max-w-5xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left side - Welcome message and features */}
                    <div className="hidden lg:flex flex-col justify-center text-white space-y-8">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-4">
                                Smart Campus<br />
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Hub</span>
                            </h1>
                            <p className="text-xl text-slate-300">Manage facilities, bookings, and support all in one place.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: BookOpen, title: 'Smart Catalogue', desc: 'Browse and manage all campus facilities' },
                                { icon: Zap, title: 'Fast Bookings', desc: 'Reserve resources with just a few clicks' },
                                { icon: Globe, title: 'Real-time Updates', desc: 'Get instant notifications about your bookings' },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{feature.title}</h3>
                                        <p className="text-sm text-slate-400">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Auth form */}
                    <div className="w-full">
                        <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>

                            <div className="relative">
                                {/* Logo area */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                            <span className="text-2xl font-black text-white">S</span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                                        {isRegister ? 'Create Account' : 'Welcome Back'}
                                    </h2>
                                    <p className="text-slate-600">
                                        {isRegister
                                            ? 'Join Smart Campus Hub and manage your bookings'
                                            : 'Sign in to access your dashboard'}
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {isRegister && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2.5">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2.5">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                                                placeholder="you@campus.edu"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2.5">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                                                placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isRegister ? 'Create Account' : 'Sign In'}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex-1 h-px bg-slate-200"></div>
                                    <span className="text-slate-400 text-sm font-medium">OR</span>
                                    <div className="flex-1 h-px bg-slate-200"></div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error('Google Login Failed')}
                                        useOneTap
                                        theme="outline"
                                        shape="pill"
                                        width="100%"
                                    />
                                </div>

                                {/* Toggle signup/login */}
                                <div className="mt-6 text-center">
                                    <p className="text-slate-600">
                                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                                        <button
                                            type="button"
                                            onClick={() => setIsRegister((prev) => !prev)}
                                            className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text hover:underline transition-all"
                                        >
                                            {isRegister ? 'Sign In' : 'Create One'}
                                        </button>
                                    </p>
                                </div>

                                {/* Security badge */}
                                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        🔒 Secure • Campus Protected • Encrypted
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
