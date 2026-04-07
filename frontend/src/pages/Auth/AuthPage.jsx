import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Smart Campus Hub</h1>
                    <p className="text-gray-500">
                        {isRegister ? 'Create your account with email and password' : 'Sign in with your email and password'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="At least 6 characters"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {submitting ? 'Please wait...' : isRegister ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsRegister((prev) => !prev)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {isRegister ? 'Login' : 'Sign Up'}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Protected by campus security protocols</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
