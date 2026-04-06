import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const response = await axios.post('http://localhost:8080/auth/login', {
                idToken: credential
            });
            
            if (response.data.token) {
                login(response.data.token);
                toast.success('Login successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Smart Campus Hub</h1>
                    <p className="text-gray-500">Access your unified campus services</p>
                </div>
                
                <div className="mt-8 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => toast.error('Google Sign-In failed')}
                        useOneTap
                        shape="pill"
                        text="continue_with"
                    />
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Protected by campus security protocols</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
