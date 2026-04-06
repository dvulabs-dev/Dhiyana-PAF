import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const GoogleLoginButton = () => {
    const { login } = useAuth();

    const handleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // For 'code' flow, send code. For 'implicit' flow, send access_token.
                // But typically we want the ID token from the backend.
                // However, @react-oauth/google's custom login hook gives access_token.
                // Let's use the default GoogleLogin component for ID token for simplicity.
                // Wait, useGoogleLogin can get an auth code.
                console.log('Login success:', tokenResponse);
            } catch (err) {
                toast.error('Login failed');
            }
        },
        onError: () => toast.error('Login failed')
    });

    return (
        <button
            onClick={() => handleLogin()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium text-gray-700"
        >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
        </button>
    );
};

export default GoogleLoginButton;
